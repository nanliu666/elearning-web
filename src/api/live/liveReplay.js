import { get } from '@/router/axios'

// 查看单个直播回放列表
export const liveReplayList = (params) => get('/api/common/v1/live/replay/videoList', params)

// 查看单个直播回放列表
export const setReplayStatus = (params) => get('/api/common/v1/live/replay/status', params)
