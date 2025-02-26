<template>
    <div>
        <DynamicIsland></DynamicIsland>

        <button @click="showPrintingNotification">
            Show printing notification
        </button>
    </div>
</template>

<script setup lang="ts">
    import CollapsedPrintingNotificationContent from './components/CollapsedPrintingNotificationContent.vue'
    import ExpandedPrintingNotificationContent from './components/ExpandedPrintingNotificationContent.vue'

    const { showDynamicIsland } = useDynamicIsland()

    const showPrintingNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent
        })
    }
</script>
