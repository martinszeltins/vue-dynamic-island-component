export const useDynamicIsland = () => {
    const { dynamicIsland } = storeToRefs(useAppStore())

    const showDynamicIsland = (options) => {
        dynamicIsland.value.isVisible = true
        dynamicIsland.value.collapsedContent = options.collapsedContent
        dynamicIsland.value.expandedContent = options.expandedContent
    }

    return {
        showDynamicIsland
    }
}
