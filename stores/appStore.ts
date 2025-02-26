interface DynamicIslandState {
    isVisible: boolean
    isExpanded: boolean
    collapsedContent: Component | null
    expandedContent: Component | null
}

export const useAppStore = defineStore('app', () => {
    const dynamicIsland = ref<DynamicIslandState>({
        isVisible: false,
        isExpanded: false,
        collapsedContent: null,
        expandedContent: null,
    })

    return {
        dynamicIsland
    }
})
