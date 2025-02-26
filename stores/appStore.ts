export const useAppStore = defineStore('app', () => {
    const dynamicIsland = ref({
        isVisible: true,
        isExpanded: false,
        collapsedContent: null,
        expandedContent: null,
    })

    return {
        dynamicIsland
    }
})
