<template>
    <div 
        v-if="dynamicIsland.isVisible" 
        class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white rounded-full p-2 transition-all duration-300 cursor-pointer"
        :class="{
            'w-80 h-auto rounded-xl': dynamicIsland.isExpanded,
            'w-52 h-10': !dynamicIsland.isExpanded
        }"
        @click="toggleExpansion">

        <!-- Collapsed Content -->
        <div v-if="!dynamicIsland.isExpanded" class="w-full">
            <component :is="dynamicIsland.collapsedContent" />
        </div>

        <!-- Expanded Content -->
        <div v-else class="w-full">
            <component :is="dynamicIsland.expandedContent" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const { dynamicIsland } = storeToRefs(useAppStore())
    
    const toggleExpansion = () => {
        dynamicIsland.value.isExpanded = !dynamicIsland.value.isExpanded
    }
</script>
