<template>
    <div 
        v-if="dynamicIsland.isVisible" 
        class="dynamic-island-component fixed top-4 left-1/2 transform -translate-x-1/2 text-white"
        :style="dynamicIslandStyle"
        @mouseenter="expandIsland"
        @mouseleave="collapseIsland">

        <!-- Content Container (with fade effect) -->
        <div :class="['dynamic-island-content-container transition-opacity duration-200', 
                     {'opacity-0': !dynamicIsland.contentVisible, 'opacity-100': dynamicIsland.contentVisible}]">
            <!-- Collapsed Content -->
            <div v-if="!dynamicIsland.isExpanded" class="w-full">
                <component :is="dynamicIsland.collapsedContent" />
            </div>

            <!-- Expanded Content -->
            <div v-else-if="dynamicIsland.expandedContent" class="w-full">
                <component :is="dynamicIsland.expandedContent" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { dynamicIsland } = storeToRefs(useAppStore())
    const { setHovered } = useDynamicIsland()
    
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
            transition: 'width 0.3s ease-out, height 0.3s ease-out, border-radius 0.3s ease-out, padding 0.3s ease-out, background-color 0.3s ease, box-shadow 0.3s ease',
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
                    style.borderRadius = 'var(--dynamic-island-border-radius-xl)'
                } else {
                    style.width = 'var(--dynamic-island-collapsed-width)'
                    style.height = 'var(--dynamic-island-collapsed-height)'
                    style.borderRadius = '9999px' // This ensures a smooth transition to full rounded
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
    
    const expandIsland = () => {
        // Set hovered state to true
        setHovered(true)
        
        // Only expand if we have expanded content
        if (dynamicIsland.value.expandedContent) {
            dynamicIsland.value.isExpanded = true
        }
    }
    
    const collapseIsland = () => {
        // Set hovered state to false
        setHovered(false)
        
        // Collapse island
        dynamicIsland.value.isExpanded = false
    }
</script>

<style scoped>
.dynamic-island-component {
    /* Using CSS variables for configuration */
    --dynamic-island-collapsed-width: 13rem; /* 52 / 4 = 13rem */
    --dynamic-island-collapsed-height: 2.5rem; /* 10 / 4 = 2.5rem */
    --dynamic-island-expanded-width: 20rem; /* 80 / 4 = 20rem */
    --dynamic-island-circle-size: 2.5rem;
    --dynamic-island-dot-size: 0.5rem;
    --dynamic-island-border-radius-full: 9999px;
    --dynamic-island-border-radius-xl: 0.75rem;
    
    cursor: default;
    /* Set specific transitions for each property for more control */
    transition-property: width, height, border-radius, padding, background-color;
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* Use a smooth standard easing curve */
}

/* Content container styles - ensures content is centered */
.dynamic-island-content-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s ease; /* Faster fade transition */
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
