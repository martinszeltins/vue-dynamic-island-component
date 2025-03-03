<template>
    <div 
        v-if="dynamicIsland.isVisible" 
        class="dynamic-island-component fixed top-4 left-1/2 transform -translate-x-1/2 text-white backdrop-blur text-[17px]"
        :class="{ 'dynamic-island-pulse-transition': dynamicIsland.pulseType }"
        :style="dynamicIslandStyle"
        @mouseenter="expandIsland"
        @mouseleave="collapseIsland">

        <!-- Collapsed Content -->
        <div 
            class="transition-opacity duration-200 px-1"
            :class="{
                'hidden': showExpandedContent,
                'opacity-0': !(showCollapsedContent && dynamicIsland.contentVisible),
                'opacity-100': showCollapsedContent && dynamicIsland.contentVisible}">
            
            <div>
                <!-- Component content -->
                <component
                    v-if="isCollapsedComponent"
                    :is="dynamicIsland.collapsedContent"
                    :class="{
                        'opacity-0': dynamicIsland.animationState !== 'content-visible',
                        'opacity-100': dynamicIsland.animationState === 'content-visible'
                    }"
                    v-bind="dynamicIsland.collapsedProps"
                />
                
                <!-- Text content with optional icon -->
                <div
                    v-else
                    class="flex items-center justify-between transition-all duration-300"
                    :class="{
                        'opacity-0': dynamicIsland.animationState !== 'content-visible',
                        'opacity-100': dynamicIsland.animationState === 'content-visible'
                    }">

                    <i
                        v-if="dynamicIsland.iconLeft"
                        :class="[dynamicIsland.iconLeft, dynamicIsland.iconLeftClasses]"
                        class="mr-2">
                    </i>

                    <div
                        class="dynamic-island-content-wrapper"
                        :class="dynamicIsland.collapsedTextClasses"
                        :style="{ width: dynamicIsland.collapsedContentWidth + 'px' }">

                        <span >{{ dynamicIsland.collapsedContent }}</span>
                    </div>

                    <i
                        v-if="dynamicIsland.iconRight"
                        :class="[dynamicIsland.iconRight, dynamicIsland.iconRightClasses]"
                        class="mr-2">
                    </i>
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
                v-bind="dynamicIsland.expandedProps"
            />
            
            <!-- Text content with optional icon -->
            <div v-else class="p-2">
                <div class="flex items-center">
                    <i v-if="dynamicIsland.iconLeft" :class="dynamicIsland.iconLeft" class="mr-2"></i>
                    <span>{{ dynamicIsland.expandedContent }}</span>
                    <i v-if="dynamicIsland.iconRight" :class="dynamicIsland.iconRight" class="mr-2"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { setHovered, dynamicIsland } = useDynamicIsland()
    
    const showCollapsedContent = ref(true)
    const showExpandedContent = ref(false)
    
    const isTransitioning = ref(false)
    
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
    
    const calculatedCollapsedWidth = computed(() => {
        return dynamicIsland.value.collapsedWidth 
            ? `${dynamicIsland.value.collapsedWidth}px` 
            : 'var(--dynamic-island-collapsed-width)'
    })
    
    const calculatedExpandedWidth = computed(() => {
        return dynamicIsland.value.expandedWidth 
            ? `${dynamicIsland.value.expandedWidth}px` 
            : 'var(--dynamic-island-expanded-width)'
    })
    
    const dynamicIslandStyle = computed(() => {
        const style: Record<string, string> = {
            padding: dynamicIsland.value.contentVisible ? '0.5rem' : '0',
            transition: 'width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 30px rgba(0, 0, 0, 0.12)'
        }
        
        if (dynamicIsland.value.pulseType && dynamicIsland.value.contentVisible) {
            style.backgroundColor = getBackgroundColor(dynamicIsland.value.type)
        } else {
            style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
        }
        
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
    
    const expandIsland = () => {
        if (isTransitioning.value) return
        
        isTransitioning.value = true
        
        setHovered(true)
        
        if (dynamicIsland.value.expandedContent) {
            showCollapsedContent.value = false
            
            setTimeout(() => {
                dynamicIsland.value.isExpanded = true
                
                setTimeout(() => {
                    showExpandedContent.value = true
                    isTransitioning.value = false
                }, 300)
            }, 200)
        } else {
            isTransitioning.value = false
        }
    }
    
    const collapseIsland = () => {
        if (isTransitioning.value) return 
        
        isTransitioning.value = true 
        
        setHovered(false)
        
        showExpandedContent.value = false
        
        setTimeout(() => {
            dynamicIsland.value.isExpanded = false
            
            setTimeout(() => {
                showCollapsedContent.value = true
                isTransitioning.value = false
            }, 300)
        }, 200)
    }
    
    watch(() => dynamicIsland.value.isVisible, (isVisible) => {
        if (isVisible) {
            showCollapsedContent.value = true
            showExpandedContent.value = false
        }
    })
    
    watch(() => dynamicIsland.value.isExpanded, (isExpanded) => {
        if (!isExpanded) {
            showCollapsedContent.value = true
            showExpandedContent.value = false
        }
    })
</script>

<style>
    .dynamic-island-component {
        --dynamic-island-collapsed-width: 15rem;
        --dynamic-island-collapsed-height: 2.6rem;
        --dynamic-island-expanded-width: 20rem;
        --dynamic-island-circle-size: 2.5rem;
        --dynamic-island-dot-size: 0.5rem;
        
        cursor: default;
        overflow: hidden;
    }
    
    .dynamic-island-content-wrapper {
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        mask-image: linear-gradient(to right, black 85%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
    }
    
    .dynamic-island-content-wrapper::after {
        display: none;
    }

    .dynamic-island-pulse-transition {
        transition: background-color 1s ease;
    }

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
