import axios from 'axios';
import qs from 'query-string';

export interface SerpTaskReq {
  keyword: string;
  num: number;
  area?: string;
  expire_time?: string;
  update_time?: string;
  state: number;
}

export interface SerpTaskRes extends SerpTaskReq {
  id: number;
}

export interface SerpTaskParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface SerpTaskListRes {
  items: SerpTaskRes[];
  total: number;
}

export interface SerpTaskDeleteParams {
  pk: number[];
}

export function querySerpTaskList(
  params: SerpTaskParams
): Promise<SerpTaskListRes> {
  return axios.get('/api/v1/serp/tasks', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function querySerpTaskDetail(pk: number): Promise<SerpTaskRes> {
  return axios.get(`/api/v1/serp/tasks/${pk}`);
}

export function createSerpTask(data: SerpTaskReq) {
  return axios.post('/api/v1/serp/tasks', data);
}

export function updateSerpTask(pk: number, data: SerpTaskReq) {
  return axios.put(`/api/v1/serp/tasks/${pk}`, data);
}

export function deleteSerpTask(params: SerpTaskDeleteParams) {
  return axios.delete(`/api/v1/serp/tasks`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface SerpDataReq {
  keyword: string;
  area?: string;
  urls?: string[];
  create_time?: string;
}

export interface SerpDataRes extends SerpDataReq {
  task_id: number;
}

export function querySerpDataRecent(taskId: number): Promise<SerpDataRes> {
  return axios.get(`/api/v1/serp/data/recent/${taskId}`);
}

export interface SerpHtmlReq {
  html: string;
}

export interface SerpHtmlRes extends SerpHtmlReq {
  task_id: number;
}

export function querySerpHtmlRecent(taskId: number): Promise<SerpHtmlRes> {
  return axios.get(`/api/v1/serp/data/html/${taskId}`);
}
