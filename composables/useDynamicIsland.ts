interface DynamicIslandOptions {
    collapsedContent: Component
    expandedContent?: Component
    hideAfter?: number
    shake?: boolean
}

export const useDynamicIsland = () => {
    const { dynamicIsland } = storeToRefs(useAppStore())

    // Helper function to clear the hide timer
    const clearHideTimer = () => {
        if (dynamicIsland.value.hideTimer) {
            clearTimeout(dynamicIsland.value.hideTimer as unknown as number)
            dynamicIsland.value.hideTimer = null
        }
    }

    // Helper function to set up a hide timer with the current duration
    const setupHideTimer = (duration: number) => {
        // Store the timer duration and start time
        dynamicIsland.value.hideTimerDuration = duration
        dynamicIsland.value.hideTimerStart = Date.now()

        // Only set the timer if we're not currently being hovered
        if (!dynamicIsland.value.isHovered) {
            dynamicIsland.value.hideTimer = setTimeout(() => {
                hideDynamicIsland()
            }, duration) as unknown as number
        }
    }

    // Function to pause the hide timer when hovering
    const pauseHideTimer = () => {
        if (dynamicIsland.value.hideTimer && dynamicIsland.value.hideTimerStart) {
            // Clear the current timer
            clearHideTimer()
            
            // Calculate the remaining time
            const timeElapsed = Date.now() - dynamicIsland.value.hideTimerStart
            const remainingTime = Math.max(0, (dynamicIsland.value.hideTimerDuration || 0) - timeElapsed)
            
            // Store the remaining time as the new duration
            dynamicIsland.value.hideTimerDuration = remainingTime
        }
    }

    // Function to resume the hide timer after hovering
    const resumeHideTimer = () => {
        // If we have a duration but no active timer, restart the timer
        if (dynamicIsland.value.hideTimerDuration && !dynamicIsland.value.hideTimer) {
            setupHideTimer(dynamicIsland.value.hideTimerDuration)
        }
    }

    const showDynamicIsland = (options: DynamicIslandOptions) => {
        // Clear any existing hide timer
        clearHideTimer()

        // Set initial animation state and visibility
        dynamicIsland.value.animationState = 'tiny-dot'
        dynamicIsland.value.isVisible = true
        dynamicIsland.value.contentVisible = false
        dynamicIsland.value.isExpanded = false
        dynamicIsland.value.isHovered = false
        
        // Set shake effect if requested
        dynamicIsland.value.shake = options.shake || false
        
        // Set content
        dynamicIsland.value.collapsedContent = markRaw(options.collapsedContent)
        dynamicIsland.value.expandedContent = options.expandedContent ? markRaw(options.expandedContent) : null

        // Animation sequence with precise timing
        setTimeout(() => {
            // Step 1: Grow to circle
            dynamicIsland.value.animationState = 'circle'
            
            setTimeout(() => {
                // Step 2: Expand to full size
                dynamicIsland.value.animationState = 'sized'
                
                setTimeout(() => {
                    // Step 3: Fade in content
                    dynamicIsland.value.animationState = 'content-visible'
                    dynamicIsland.value.contentVisible = true
                    
                    // Apply shake effect if enabled (after content is visible)
                    if (dynamicIsland.value.shake) {
                        // Wait for content to be visible before shaking
                        setTimeout(() => {
                            const element = document.querySelector('.dynamic-island') as HTMLElement
                            if (element) {
                                element.classList.add('shake-animation')
                                setTimeout(() => {
                                    element.classList.remove('shake-animation')
                                }, 800) // Increased shake duration
                            }
                        }, 100)
                    }
                }, 300) // Slower transition
            }, 300) // Slower transition
        }, 30)

        // Set hide timer if specified or use default of 5 seconds
        const hideAfter = options.hideAfter !== undefined ? options.hideAfter : 5000
        
        if (hideAfter > 0) {
            setupHideTimer(hideAfter)
        }
    }

    const hideDynamicIsland = () => {
        // Clear any existing hide timer
        clearHideTimer()
        
        // Reset timer related values
        dynamicIsland.value.hideTimerDuration = null
        dynamicIsland.value.hideTimerStart = null

        // Collapse first if expanded
        dynamicIsland.value.isExpanded = false
        
        // Start hide animation sequence
        // Step 1: Hide content with fade out
        dynamicIsland.value.animationState = 'content-hiding'
        dynamicIsland.value.contentVisible = false
        
        setTimeout(() => {
            // Step 2: Shrink to circle
            dynamicIsland.value.animationState = 'shrinking'
            
            setTimeout(() => {
                // Step 3: Scale down to disappear
                dynamicIsland.value.animationState = 'disappearing'
                
                // Finally hide the element
                setTimeout(() => {
                    dynamicIsland.value.isVisible = false
                    dynamicIsland.value.animationState = 'hidden'
                    dynamicIsland.value.shake = false
                    dynamicIsland.value.isHovered = false
                }, 400) // Slower disappearing
            }, 300) // Slower shrinking
        }, 300) // Slower content hiding
    }

    // Set hover state to true and pause timer
    const setHovered = (isHovered: boolean) => {
        dynamicIsland.value.isHovered = isHovered
        
        if (isHovered) {
            pauseHideTimer()
        } else {
            resumeHideTimer()
        }
    }

    return {
        showDynamicIsland,
        hideDynamicIsland,
        setHovered
    }
}
