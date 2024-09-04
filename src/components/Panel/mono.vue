<template>
    <div class="panel-mono">
        <useCzmHelper ref="czmhelper" />
        <v-card title="城市白膜" subtitle="示例数据">
            <v-card-actions>
                <v-radio-group inline>
                    <v-radio label="Radio One" value="one"></v-radio>
                    <v-radio label="Radio Two" value="two"></v-radio>
                    <v-radio label="Radio Three" value="three"></v-radio>
                </v-radio-group>  
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import useCzmHelper from '@/hook/useCzmHelper.vue';

</script>

<style lang="scss" scoped></style>