<template>
    <div class="index">
        <HeadNav/>
        <LeftMenu/>
        <div class="rightContainer">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import HeadNav from "@/components/HeadNav";
import LeftMenu from "@/components/LeftMenu";
import Breadcrumb from '@/components/Breadcrumb'
export default {
    name: "index",
    components: {
        HeadNav,
        LeftMenu,
        Breadcrumb
    }
};
</script>

<style scoped>
.index {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.breadcrumb-container {
    position: relative;
    top: 0;
    left: 180px;
    width: calc(100% - 180px);
    height: 20px;
    background: #324057;
    border-bottom: 1px solid #1f2d3d;
}

.rightContainer {
    position: relative;
    top: 0;
    left: 180px;
    width: calc(100% - 180px);
    height: calc(100% - 71px);
    overflow: auto;
}
</style>
