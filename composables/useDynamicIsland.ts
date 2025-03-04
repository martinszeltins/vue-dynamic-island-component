interface DynamicIslandOptions {
    collapsedContent: Component | string
    expandedContent?: Component | string
    iconLeft?: string
    iconLeftClasses?: string
    iconRight?: string
    iconRightClasses?: string
    collapsedTextClasses?: string,
    hideAfter?: number
    shake?: boolean
    type?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    collapsedWidth?: number
    expandedWidth?: number
    collapsedContentWidth?: number
    pulseType?: boolean
    collapsedProps?: Record<string, any>
    expandedProps?: Record<string, any>
}

interface DynamicIslandState {
    isVisible: boolean
    isExpanded: boolean
    collapsedContent: Component | string | null
    expandedContent: Component | string | null
    iconRight: string | null
    iconLeft: string | null
    collapsedTextClasses: string | null
    hideTimer: number | null
    hideTimerDuration: number | null
    hideTimerStart: number | null
    shake: boolean
    animationState: 'hidden' | 'tiny-dot' | 'circle' | 'sized' | 'content-visible' | 'content-hiding' | 'shrinking' | 'disappearing'
    contentVisible: boolean
    isHovered: boolean
    type: 'default' | 'success' | 'warning' | 'danger' | 'info'
    collapsedWidth: number | null
    expandedWidth: number | null
    collapsedContentWidth: number | null
    pulseType: boolean
    collapsedProps: Record<string, any> | null
    expandedProps: Record<string, any> | null
    iconLeftClasses: string | null
    iconRightClasses: string | null
}

export const useDynamicIsland = () => {
    const dynamicIsland = useState<DynamicIslandState>('dynamic-island', () => {
        return {
            isVisible: false,
            isExpanded: false,
            collapsedContent: null,
            expandedContent: null,
            iconRight: null,
            iconLeft: null,
            collapsedTextClasses: null,
            hideTimer: null,
            hideTimerDuration: null,
            hideTimerStart: null,
            shake: false,
            animationState: 'hidden',
            contentVisible: false,
            isHovered: false,
            type: 'default',
            collapsedWidth: null,
            expandedWidth: null,
            pulseType: false,
            collapsedProps: null,
            collapsedContentWidth: null,
            expandedProps: null,
            iconLeftClasses: null,
            iconRightClasses: null,
        }
    })
    
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

        // Set the notification type (default is 'default')
        dynamicIsland.value.type = options.type || 'default'

        // Set custom widths if provided
        dynamicIsland.value.collapsedWidth = options.collapsedWidth || null
        dynamicIsland.value.expandedWidth = options.expandedWidth || null
        dynamicIsland.value.collapsedContentWidth = options.collapsedContentWidth || null

        // Set pulse type
        dynamicIsland.value.pulseType = options.pulseType || false

        // Set content and props
        dynamicIsland.value.collapsedContent = typeof options.collapsedContent === 'string' 
            ? options.collapsedContent 
            : markRaw(options.collapsedContent)
        dynamicIsland.value.expandedContent = options.expandedContent 
            ? (typeof options.expandedContent === 'string' 
                ? options.expandedContent 
                : markRaw(options.expandedContent)) 
            : null

        // Set the component props
        dynamicIsland.value.collapsedProps = options.collapsedProps || null
        dynamicIsland.value.expandedProps = options.expandedProps || null

        // Set icon if provided
        dynamicIsland.value.iconRight = options.iconRight || null
        dynamicIsland.value.iconRightClasses = options.iconRightClasses || null
        dynamicIsland.value.iconLeftClasses = options.iconLeftClasses || null
        dynamicIsland.value.iconLeft = options.iconLeft || null
        dynamicIsland.value.collapsedTextClasses = options.collapsedTextClasses || null

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
                        setTimeout(() => {
                            const element = document.querySelector('.dynamic-island-component') as HTMLElement
                            if (element) {
                                element.classList.add('dynamic-island-shake-animation')
                                setTimeout(() => {
                                    element.classList.remove('dynamic-island-shake-animation')
                                }, 800)
                            }
                        }, 100)
                    }
                }, 300)
            }, 300)
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
        
        setTimeout(() => {
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
        }, 200)
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
        setHovered,
        dynamicIsland,
    }
}
