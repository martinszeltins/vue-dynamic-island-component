interface DynamicIslandState {
    isVisible: boolean
    isExpanded: boolean
    collapsedContent: Component | null
    expandedContent: Component | null
    hideTimer: number | null
    hideTimerDuration: number | null
    hideTimerStart: number | null
    shake: boolean
    animationState: 'hidden' | 'tiny-dot' | 'circle' | 'sized' | 'content-visible' | 'content-hiding' | 'shrinking' | 'disappearing'
    contentVisible: boolean
    isHovered: boolean
    type: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export const useAppStore = defineStore('app', () => {
    const dynamicIsland = ref<DynamicIslandState>({
        isVisible: false,
        isExpanded: false,
        collapsedContent: null,
        expandedContent: null,
        hideTimer: null,
        hideTimerDuration: null,
        hideTimerStart: null,
        shake: false,
        animationState: 'hidden',
        contentVisible: false,
        isHovered: false,
        type: 'default'
    })

    return {
        dynamicIsland
    }
})
