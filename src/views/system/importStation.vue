<template>
    <div>
        <importDataByFile title="导入岗位" :downloadErrorFunction="errorFile" :downloadTemplate="template" :uploadFunction="importLecturer"></importDataByFile>         
    </div>
</template>
<script>
import {importPosition,downloadPositionTemplate,importPositionErrorFile} from '@/api/system/station'
import importDataByFile from '@/components/importData/importData.vue'
export default {
    components:{
        importDataByFile
    },
    methods:{
        importLecturer(params){
            return importPosition(params)
        },
        template(){
            return downloadPositionTemplate()
        },
        errorFile(params){
            return importPositionErrorFile(params)
        }
    }
}
</script>
<style lang="scss">
    
</style>