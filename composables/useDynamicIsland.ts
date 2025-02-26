interface DynamicIslandOptions {
    collapsedContent: Component
    expandedContent: Component
}

export const useDynamicIsland = () => {
    const { dynamicIsland } = storeToRefs(useAppStore())

    const showDynamicIsland = (options: DynamicIslandOptions) => {
        dynamicIsland.value.isVisible = true
        dynamicIsland.value.collapsedContent = markRaw(options.collapsedContent)
        dynamicIsland.value.expandedContent = markRaw(options.expandedContent)
    }

    const hideDynamicIsland = () => {
        dynamicIsland.value.isExpanded = false

        setTimeout(() => dynamicIsland.value.isVisible = false, 1000)
    }

    return {
        showDynamicIsland,
        hideDynamicIsland
    }
}
