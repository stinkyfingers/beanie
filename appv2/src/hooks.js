import { useQuery } from 'react-query';
import * as api from './api';

const useFamily = (family, startKey) => useQuery(['useFamily', family, startKey], () => api.family(family, startKey), { refetchOnMount: false });

const useBeanie = (token, family, name) => useQuery(['useBeanie', token, family, name], () => api.get(token, family, name));

export {
  useFamily,
  useBeanie
};
