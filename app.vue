<template>
    <div>
        <DynamicIsland></DynamicIsland>

        <div class="flex space-x-4 p-4">
            <button @click="showPrintingNotification" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Show printing notification
            </button>
            
            <button @click="showShakingNotification" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Show shaking notification
            </button>
            
            <button @click="showLongDurationNotification" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Show 10s notification
            </button>
            
            <button @click="showCollapsedOnlyNotification" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Show collapsed-only notification
            </button>
        </div>
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
    
    const showShakingNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent,
            shake: true
        })
    }
    
    const showLongDurationNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent,
            hideAfter: 6000 // 6 seconds
        })
    }
    
    const showCollapsedOnlyNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent
            // No expanded content
        })
    }
</script>
