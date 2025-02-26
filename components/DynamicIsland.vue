<template>
    <div 
        v-if="dynamicIsland.isVisible" 
        class="dynamic-island-component fixed top-4 left-1/2 transform -translate-x-1/2 text-white"
        :style="dynamicIslandStyle"
        @mouseenter="expandIsland"
        @mouseleave="collapseIsland">

        <!-- Collapsed Content -->
        <div 
            class="transition-opacity duration-200 px-1"
            :class="{'opacity-0': !showCollapsedContent, 'opacity-100': showCollapsedContent}"
            v-show="showCollapsedContent && dynamicIsland.contentVisible">
            <component :is="dynamicIsland.collapsedContent" />
        </div>

        <!-- Expanded Content -->
        <div 
            v-if="dynamicIsland.expandedContent"
            class="transition-opacity duration-200 px-1"
            :class="{'opacity-0': !showExpandedContent, 'opacity-100': showExpandedContent}"
            v-show="showExpandedContent && dynamicIsland.contentVisible">
            <component :is="dynamicIsland.expandedContent" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const { dynamicIsland } = storeToRefs(useAppStore())
    const { setHovered } = useDynamicIsland()
    
    // Refs to control content visibility
    const showCollapsedContent = ref(true)
    const showExpandedContent = ref(false)
    
    // Get background color based on type
    const getBackgroundColor = (type: string) => {
        switch (type) {
            case 'success': return '#10B981' // green-500
            case 'warning': return '#F59E0B' // amber-500
            case 'danger': return '#EF4444'  // red-500
            case 'info': return '#3B82F6'    // blue-500
            default: return '#000000'        // black
        }
    }
    
    // Create style object with dynamic properties for smoother transitions
    const dynamicIslandStyle = computed(() => {
        const style = {
            padding: dynamicIsland.value.contentVisible ? '0.5rem' : '0',
            transition: 'width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
            backgroundColor: getBackgroundColor(dynamicIsland.value.type),
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 30px rgba(0, 0, 0, 0.12)' // Soft, layered shadow
        }
        
        // Set dimensions and border-radius based on state
        switch (dynamicIsland.value.animationState) {
            case 'tiny-dot':
                style.width = 'var(--dynamic-island-dot-size)'
                style.height = 'var(--dynamic-island-dot-size)'
                style.borderRadius = '50%'
                break
            case 'circle':
                style.width = 'var(--dynamic-island-circle-size)'
                style.height = 'var(--dynamic-island-circle-size)'
                style.borderRadius = '50%'
                break
            case 'sized':
            case 'content-visible':
            case 'content-hiding':
                if (dynamicIsland.value.isExpanded) {
                    style.width = 'var(--dynamic-island-expanded-width)'
                    style.height = 'auto'
                    style.minHeight = 'var(--dynamic-island-collapsed-height)'
                    style.borderRadius = '0.75rem'
                } else {
                    style.width = 'var(--dynamic-island-collapsed-width)'
                    style.height = 'var(--dynamic-island-collapsed-height)'
                    style.borderRadius = '999px'
                }
                break
            case 'shrinking':
                style.width = 'var(--dynamic-island-circle-size)'
                style.height = 'var(--dynamic-island-circle-size)'
                style.borderRadius = '50%'
                break
            case 'disappearing':
                style.width = 'var(--dynamic-island-dot-size)'
                style.height = 'var(--dynamic-island-dot-size)'
                style.borderRadius = '50%'
                break
        }
        
        return style
    })
    
    // Function to expand the island with sequential animation
    const expandIsland = () => {
        // Set hovered state to true
        setHovered(true)
        
        // Only expand if we have expanded content
        if (dynamicIsland.value.expandedContent) {
            // Step 1: Fade out the collapsed content
            showCollapsedContent.value = false
            
            // Step 2: After content fades out, expand the container
            setTimeout(() => {
                dynamicIsland.value.isExpanded = true
                
                // Step 3: After container expands, fade in the expanded content
                setTimeout(() => {
                    showExpandedContent.value = true
                }, 300) // Wait for expansion to complete
            }, 200) // Wait for fade out to complete
        }
    }
    
    // Function to collapse the island with sequential animation
    const collapseIsland = () => {
        // Set hovered state to false
        setHovered(false)
        
        // Step 1: Fade out the expanded content
        showExpandedContent.value = false
        
        // Step 2: After content fades out, collapse the container
        setTimeout(() => {
            dynamicIsland.value.isExpanded = false
            
            // Step 3: After container collapses, fade in the collapsed content
            setTimeout(() => {
                showCollapsedContent.value = true
            }, 300) // Wait for collapse to complete
        }, 200) // Wait for fade out to complete
    }
    
    // Reset content visibility when the dynamic island appears or disappears
    watch(() => dynamicIsland.value.isVisible, (isVisible) => {
        if (isVisible) {
            showCollapsedContent.value = true
            showExpandedContent.value = false
        }
    })
    
    // Reset content visibility when expanded state changes programmatically
    watch(() => dynamicIsland.value.isExpanded, (isExpanded) => {
        if (!isExpanded) {
            showCollapsedContent.value = true
            showExpandedContent.value = false
        }
    })
</script>

<style scoped>
.dynamic-island-component {
    /* Using CSS variables for configuration */
    --dynamic-island-collapsed-width: 13rem; /* 52 / 4 = 13rem */
    --dynamic-island-collapsed-height: 2.5rem; /* 10 / 4 = 2.5rem */
    --dynamic-island-expanded-width: 20rem; /* 80 / 4 = 20rem */
    --dynamic-island-circle-size: 2.5rem;
    --dynamic-island-dot-size: 0.5rem;
    
    cursor: default;
    overflow: hidden;
}

/* Animation for shake */
.dynamic-island-shake-animation {
    animation: dynamic-island-shake 0.8s cubic-bezier(.36,.07,.19,.97) both; /* Longer shake duration */
}

@keyframes dynamic-island-shake {
    10%, 90% {
        transform: translateX(-50%) translate3d(-3px, 0, 0); /* Increased amplitude */
    }
    
    20%, 80% {
        transform: translateX(-50%) translate3d(6px, 0, 0); /* Increased amplitude */
    }

    30%, 50%, 70% {
        transform: translateX(-50%) translate3d(-9px, 0, 0); /* Increased amplitude */
    }

    40%, 60% {
        transform: translateX(-50%) translate3d(9px, 0, 0); /* Increased amplitude */
    }
}
</style>
