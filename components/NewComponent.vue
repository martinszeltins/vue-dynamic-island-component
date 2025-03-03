<template>
    <div>
        New Component <button @click="showNotification">Show notification</button>
    </div>
</template>

<script setup lang="ts">
    const { showDynamicIsland } = useDynamicIsland()

    const showNotification = () => {
        showDynamicIsland({
            collapsedContent: 'Collapsed content',
            expandedContent: 'Expanded content',
            type: 'default'
        })
    }
</script>
