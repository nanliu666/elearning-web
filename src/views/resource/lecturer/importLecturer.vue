<template>
    <div>
        <importDataByFile title="导入讲师" :downloadErrorFunction="errorFile" :downloadTemplate="template" :uploadFunction="importLecturer"></importDataByFile>         
    </div>
</template>
<script>
import {importLecturer,downloadLecturerTemplate,importLecturerErrorFile} from '@/api/lecturer/lecturer'
import importDataByFile from '@/components/importData/importData.vue'
export default {
    components:{
        importDataByFile
    },
    methods:{
        importLecturer(params){
            return importLecturer(params)
        },
        template(){
            return downloadLecturerTemplate()
        },
        errorFile(params){
            return importLecturerErrorFile(params)
        }
    }
}
</script>
<style lang="scss">
    
</style>