<script lang="ts" setup>
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all duration-300" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex hover:cursor-pointer hover:bg-base-200 p-2" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
        <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="32" />
        <Icon v-else name="tabler:chevron-right" size="32" />
      </div>
      <div class="flex flex-col">
        <SidebarButton :show-label="isSidebarOpen" label="Locations" icon="tabler:map" href="/dashboard" />
        <SidebarButton :show-label="isSidebarOpen" label="Add Location" icon="tabler:circle-plus-filled" href="/dashboard/add" />
        <div class="divider" />
        <SidebarButton :show-label="isSidebarOpen" label="Sign Out" icon="tabler:logout-2" href="/sign-out" />
      </div>
    </div>
    <div class="flex-1" />
  </div>
</template>
