interface DynamicIslandState {
    isVisible: boolean
    isExpanded: boolean
    collapsedContent: Component | string | null
    expandedContent: Component | string | null
    icon: string | null
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
    pulseType: boolean
}

export const useAppStore = defineStore('app', () => {
    const dynamicIsland = ref<DynamicIslandState>({
        isVisible: false,
        isExpanded: false,
        collapsedContent: null,
        expandedContent: null,
        icon: null,
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
        pulseType: false
    })

    return {
        dynamicIsland
    }
})
