<template>
    <div 
        v-if="dynamicIsland.isVisible" 
        class="dynamic-island-component fixed top-4 left-1/2 transform -translate-x-1/2 text-white backdrop-blur"
        :class="{ 'dynamic-island-pulse-transition': dynamicIsland.pulseType }"
        :style="dynamicIslandStyle"
        @mouseenter="expandIsland"
        @mouseleave="collapseIsland">

        <!-- Collapsed Content -->
        <div 
            class="transition-opacity duration-200 px-1"
            :class="{'opacity-0': !showCollapsedContent, 'opacity-100': showCollapsedContent}"
            v-show="showCollapsedContent && dynamicIsland.contentVisible">
            
            <div class="dynamic-island-content-wrapper">
                <!-- Component content -->
                <component
                    v-if="isCollapsedComponent"
                    :is="dynamicIsland.collapsedContent"
                />
                
                <!-- Text content with optional icon -->
                <div v-else class="flex items-center justify-between">
                    <span>{{ dynamicIsland.collapsedContent }}</span>
                    <i v-if="dynamicIsland.icon" :class="dynamicIsland.icon" class="mr-2"></i>
                </div>
            </div>
        </div>

        <!-- Expanded Content -->
        <div 
            v-if="dynamicIsland.expandedContent"
            class="transition-opacity duration-200 px-1"
            :class="{'opacity-0': !showExpandedContent, 'opacity-100': showExpandedContent}"
            v-show="showExpandedContent && dynamicIsland.contentVisible">

            <!-- Component content -->
            <component
                v-if="isExpandedComponent"
                :is="dynamicIsland.expandedContent"
            />
            
            <!-- Text content with optional icon -->
            <div v-else class="p-2">
                <div class="flex items-center">
                    <i v-if="dynamicIsland.icon" :class="dynamicIsland.icon" class="mr-2"></i>
                    <span>{{ dynamicIsland.expandedContent }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { setHovered } = useDynamicIsland()
    const { dynamicIsland } = storeToRefs(useAppStore())
    
    const showCollapsedContent = ref(true)
    const showExpandedContent = ref(false)
    
    const isTransitioning = ref(false)
    
    // Computed properties to check if content is a component or text
    const isCollapsedComponent = computed(() => {
        return typeof dynamicIsland.value.collapsedContent !== 'string'
    })
    
    const isExpandedComponent = computed(() => {
        return typeof dynamicIsland.value.expandedContent !== 'string'
    })
    
    const getBackgroundColor = (type: string) => {
        switch (type) {
            case 'success': return 'rgba(16, 185, 129, 0.9)' 
            case 'warning': return 'rgba(245, 158, 11, 0.9)' 
            case 'danger': return 'rgba(199, 29, 29, 0.9)'  
            case 'info': return 'rgba(59, 130, 246, 0.9)'    
            default: return 'rgba(0, 0, 0, 0.75)'
        }
    }
    
    // Calculate the collapsed width based on custom value or default
    const calculatedCollapsedWidth = computed(() => {
        return dynamicIsland.value.collapsedWidth 
            ? `${dynamicIsland.value.collapsedWidth}px` 
            : 'var(--dynamic-island-collapsed-width)'
    })
    
    // Calculate the expanded width based on custom value or default
    const calculatedExpandedWidth = computed(() => {
        return dynamicIsland.value.expandedWidth 
            ? `${dynamicIsland.value.expandedWidth}px` 
            : 'var(--dynamic-island-expanded-width)'
    })
    
    // Create style object with dynamic properties for smoother transitions
    const dynamicIslandStyle = computed(() => {
        const style: Record<string, string> = {
            padding: dynamicIsland.value.contentVisible ? '0.5rem' : '0',
            transition: 'width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 30px rgba(0, 0, 0, 0.12)' // Soft, layered shadow
        }
        
        // Set background color based on type
        if (dynamicIsland.value.pulseType && dynamicIsland.value.contentVisible) {
            style.backgroundColor = getBackgroundColor(dynamicIsland.value.type)
        } else {
            style.backgroundColor = 'rgba(0, 0, 0, 0.8)' // Default black
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
                    style.width = calculatedExpandedWidth.value
                    style.height = 'auto'
                    style.minHeight = 'var(--dynamic-island-collapsed-height)'
                    style.borderRadius = '0.75rem'
                } else {
                    style.width = calculatedCollapsedWidth.value
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
        if (isTransitioning.value) return // Prevent triggering during transition
        
        isTransitioning.value = true
        
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
                    isTransitioning.value = false // Reset transitioning flag
                }, 300) // Wait for expansion to complete
            }, 200) // Wait for fade out to complete
        } else {
            isTransitioning.value = false // Reset transitioning flag if no expanded content
        }
    }
    
    // Function to collapse the island with sequential animation
    const collapseIsland = () => {
        if (isTransitioning.value) return // Prevent triggering during transition
        
        isTransitioning.value = true // Set transitioning flag
        
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
                isTransitioning.value = false // Reset transitioning flag
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
    /* All custom css classes are prefixed with `dynamic-island-` */
    .dynamic-island-component {
        /* Using CSS variables for configuration */
        --dynamic-island-collapsed-width: 15rem; /* 52 / 4 = 13rem */
        --dynamic-island-collapsed-height: 2.5rem; /* 10 / 4 = 2.5rem */
        --dynamic-island-expanded-width: 20rem; /* 80 / 4 = 20rem */
        --dynamic-island-circle-size: 2.5rem;
        --dynamic-island-dot-size: 0.5rem;
        
        cursor: default;
        overflow: hidden;
    }
    
    /* Wrapper for the collapsed content with text overflow handling */
    .dynamic-island-content-wrapper {
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        mask-image: linear-gradient(to right, black 85%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
    }
    
    /* Remove the after element since we're using mask instead */
    .dynamic-island-content-wrapper::after {
        display: none;
    }

    /* Animation for pulse transition */
    .dynamic-island-pulse-transition {
        transition: background-color 1s ease;
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
