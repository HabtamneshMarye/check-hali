
import { useState, useEffect, useCallback } from 'react';
import { fetchArvByClinic, updateArv } from '../utils/fetchArv';
type ArvStatus = 'Available' | 'Not Available';
interface ArvHook {
  arvStatus: ArvStatus;
  setArvStatus: (status: ArvStatus) => void;
  loading: boolean;
  error: string | null;
  saveArvStatus: (status: ArvStatus) => Promise<void>;
}
export const useArv = (clinicId: string | null): ArvHook => {
  const [arvStatus, setArvStatus] = useState<ArvStatus>('Not Available');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!clinicId) {
      setLoading(false);
      return;
    }
    const loadArvStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const arvRecord = await fetchArvByClinic(clinicId);
        if (arvRecord && arvRecord.arv_availability) {
          const status = arvRecord.arv_availability.toLowerCase() === 'available'
            ? 'Available'
            : 'Not Available';
          setArvStatus(status);
        } else {
          setArvStatus('Not Available');
        }
      } catch (err) {
        console.error('ARV initial fetch failed:', err);
        setError('Failed to load ARV status.');
      } finally {
        setLoading(false);
      }
    };
    loadArvStatus();
  }, [clinicId]);
  const saveArvStatus = useCallback(async (status: ArvStatus) => {
    if (!clinicId) {
      setError('Cannot save: Clinic ID is missing.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateArv(clinicId, status);
      setArvStatus(status);
    } catch (err) {
      const message = (err as Error).message || 'Failed to update ARV availability.';
      setError(message);
      await fetchArvByClinic(clinicId).then(arvRecord => {
        if (arvRecord) {
          setArvStatus(arvRecord.arv_availability.toLowerCase() === 'available' ? 'Available' : 'Not Available');
        } else {
          setArvStatus('Not Available');
        }
      }).catch(console.error);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [clinicId]);
  return { arvStatus, setArvStatus, loading, error, saveArvStatus };
};