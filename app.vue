<template>
    <div>
        <DynamicIsland></DynamicIsland>

        <div class="flex flex-wrap gap-4 p-4">
            <button @click="showSimpleTextNotification" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                Show Printing...
            </button>

            <button @click="showPrintingNotification" class="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Default Notification
            </button>
            
            <button @click="showSuccessNotification" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Success Notification
            </button>
            
            <button @click="showWarningNotification" class="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                Warning Notification
            </button>
            
            <button @click="showDangerNotification" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Danger Notification (width, pulse)
            </button>
            
            <button @click="showInfoNotification" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Info Notification
            </button>
            
            <button @click="showShakingNotification" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Shaking Notification
            </button>
            
            <button @click="showLongDurationNotification" class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                10s Notification
            </button>
            
            <button @click="showCollapsedOnlyNotification" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Collapsed-only Notification
            </button>

            <div style="font-size: 16px; max-height:800px;overflow:auto;padding: 10px;background: #f8f8f8;border-radius: 4px;font-family: monospace;"><pre><b></b> {{ dynamicIsland }}</pre></div><br><br>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CollapsedPrintingNotificationContent from './components/CollapsedPrintingNotificationContent.vue'
    import ExpandedPrintingNotificationContent from './components/ExpandedPrintingNotificationContent.vue'

    const { showDynamicIsland } = useDynamicIsland()
    const { dynamicIsland: storeDynamicIsland } = storeToRefs(useAppStore())

    const dynamicIsland = computed(() => {
        return { ...storeDynamicIsland.value, collapsedContent: '<Component>', expandedContent: '<Component>' }
    })

    const showPrintingNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            collapsedProps: { title: 'Collapsed title goes here' },
            expandedContent: ExpandedPrintingNotificationContent,
            expandedProps: { title: 'Expanded title' },
            collapsedContentWidth: 145,
            type: 'default',
        })
    }
    
    const showSuccessNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent,
            type: 'success'
        })
    }
    
    const showWarningNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent,
            type: 'warning'
        })
    }
    
    const showDangerNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent,
            collapsedWidth: 250,
            expandedWidth: 500,
            pulseType: true,
            type: 'danger',
        })
    }
    
    const showInfoNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent,
            pulseType: true,
            type: 'info'
        })
    }
    
    const showShakingNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent,
            shake: true,
            hideAfter: 6000,
            pulseType: true,
            type: 'danger'
        })
    }
    
    const showLongDurationNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            expandedContent: ExpandedPrintingNotificationContent,
            hideAfter: 10000, // 10 seconds
            type: 'info'
        })
    }
    
    const showCollapsedOnlyNotification = () => {
        showDynamicIsland({
            collapsedContent: CollapsedPrintingNotificationContent,
            // No expanded content
            type: 'success'
        })
    }

    /**
     * When we don't want to use components for collapsedContent and expandedContent,
     * then we also have the option to use simple text for collapsedContent and expandedContent
     * and we can also provide an icon.
     */
    const showSimpleTextNotification = () => {
        showDynamicIsland({
            collapsedContent: 'Printing...',
            hideAfter: 2000,
            collapsedWidth: 220,
            collapsedContentWidth: 200,
            collapsedTextClasses: 'text-center',
            iconRightClasses: 'fa-spin',
            iconLeft: 'fa-solid fa-print',
            iconRight: 'fa-solid fa-spinner',
        })
    }
</script>
