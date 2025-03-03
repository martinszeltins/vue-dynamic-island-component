<template>
    <div class="flex items-center justify-between gap-3">
        <div
            class="dynamic-island-content-wrapper"
            :style="{ width: dynamicIsland.collapsedContentWidth + 'px' }">

            <div v-if="props.title">{{ props.title }}</div>
            <div v-if="!props.title">Printing a lot of documents because they are all very important...</div>
        </div>

        <button
            @click="cancelPrinting"
            class="bg-gray-700 px-2 py-1 rounded-full text-xs">
            
            Cancel
        </button>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        title?: string
    }>()

    const { hideDynamicIsland } = useDynamicIsland()
    const { dynamicIsland } = storeToRefs(useAppStore())

    const cancelPrinting = () => {
        hideDynamicIsland()
    }
</script>
