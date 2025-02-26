<template>
    <div 
        v-if="dynamicIsland.isVisible" 
        class="dynamic-island fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white transition-all duration-300"
        :class="[
            dynamicIslandClasses,
            {'p-2': dynamicIsland.contentVisible}
        ]"
        @mouseenter="expandIsland"
        @mouseleave="collapseIsland">

        <!-- Content Container (with fade effect) -->
        <div :class="['content-container transition-opacity duration-200', 
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
    
    const dynamicIslandClasses = computed(() => {
        const classes = []
        
        // Animation states based on the current phase
        switch (dynamicIsland.value.animationState) {
            case 'tiny-dot':
                classes.push('tiny-dot rounded-full')
                break
            case 'circle':
                classes.push('circle rounded-full')
                break
            case 'sized':
            case 'content-visible':
            case 'content-hiding':
                // Shape based on expanded state
                if (dynamicIsland.value.isExpanded) {
                    classes.push('expanded rounded-xl')
                } else {
                    classes.push('collapsed rounded-full')
                }
                break
            case 'shrinking':
                classes.push('circle rounded-full')
                break
            case 'disappearing':
                classes.push('tiny-dot rounded-full')
                break
        }
        
        // Add shake class if needed
        if (dynamicIsland.value.shake && dynamicIsland.value.animationState === 'content-visible') {
            classes.push('shake-ready')
        }
        
        return classes
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
.dynamic-island {
    /* Using CSS variables for configuration */
    --collapsed-width: 13rem; /* 52 / 4 = 13rem */
    --collapsed-height: 2.5rem; /* 10 / 4 = 2.5rem */
    --expanded-width: 20rem; /* 80 / 4 = 20rem */
    --circle-size: 2.5rem;
    --dot-size: 0.5rem;
    
    cursor: default;
    /* Set common transition properties - slower transitions */
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); /* Slight bounce effect with longer duration */
}

/* Content container styles - ensures content is centered */
.content-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.4s ease; /* Slower fade transition */
}

/* Size states */
.tiny-dot {
    width: var(--dot-size);
    height: var(--dot-size);
    padding: 0;
    overflow: hidden;
}

.circle {
    width: var(--circle-size);
    height: var(--circle-size);
    padding: 0;
    overflow: hidden;
}

.collapsed {
    width: var(--collapsed-width);
    height: var(--collapsed-height);
    overflow: hidden;
}

.expanded {
    width: var(--expanded-width);
    height: auto;
    min-height: var(--collapsed-height);
}

/* Animation for shake */
.shake-animation {
    animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both; /* Longer shake duration */
}

@keyframes shake {
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
