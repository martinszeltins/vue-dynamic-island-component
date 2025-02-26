<template>
    <div class="flex items-center justify-between">
        <div>Printing...</div>
        
        <button
            @click="cancelPrinting"
            class="bg-gray-700 px-2 py-1 rounded-full text-xs">
            
            Cancel
        </button>
    </div>
</template>

<script setup lang="ts">
    const { hideDynamicIsland } = useDynamicIsland()

    const cancelPrinting = () => {
        hideDynamicIsland()
    }
</script>
