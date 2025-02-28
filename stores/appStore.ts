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

export const useAppStore = defineStore('app', () => {
    const dynamicIsland = ref<DynamicIslandState>({
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
    })

    return {
        dynamicIsland
    }
})
