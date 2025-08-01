// model/components/Store/ItemDetailModal.tsx
'use client';

import React from 'react';
import ItemCard from '@/app/model/components/hub/ItemCard';
import type { StoreItem, ModelItem, DatasetItem } from '@/app/model/components/types';
import styles from '@/app/model/assets/ItemDetailModal.module.scss';

interface ItemDetailModalProps {
  show: boolean;
  item: StoreItem | null;
  type: 'models' | 'datasets';
  loading: boolean;
  onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ show, item, type, loading, onClose }) => {
  if (!show) return null;

  const model = type === 'models' ? (item as ModelItem) : null;
  const dataset = type === 'datasets' ? (item as DatasetItem) : null;

  const renderModelDetails = () => (
    model && <>
      <div className={styles.infoGrid}>
        {model.base_model && model.base_model !== "Unknown" && <div><span className={styles.infoLabel}>베이스 모델</span><p>{model.base_model}</p></div>}
        {model.training_method && model.training_method !== "Unknown" && <div><span className={styles.infoLabel}>학습 방법</span><p>{model.training_method}</p></div>}
        {model.user_name && model.user_name !== "Unknown" && <div><span className={styles.infoLabel}>생성자</span><p>{model.user_name}</p></div>}
        {model.commit_msg && model.commit_msg !== "Unknown" && <div><span className={styles.infoLabel}>커밋 메시지</span><p>{model.commit_msg}</p></div>}
      </div>
      <h3 className={styles.sectionTitle}>모델 특성</h3>
      <div className={styles.badges}>
        {model.use_deepspeed && <span>DeepSpeed</span>}
        {model.use_peft && <span>PEFT</span>}
        {model.use_sfttrainer && <span>SFT Trainer</span>}
        {model.use_stableadamw && <span>Stable AdamW</span>}
        {model.use_flash_attention && <span>Flash Attention</span>}
      </div>
    </>
  );

  const renderDatasetDetails = () => (
    dataset && <>
      <div className={styles.infoGrid}>
        {dataset.user_name && dataset.user_name !== "Unknown" && <div><span className={styles.infoLabel}>생성자</span><p>{dataset.user_name}</p></div>}
        {dataset.main_task && dataset.main_task !== "Unknown" && <div><span className={styles.infoLabel}>주요 작업</span><p>{dataset.main_task}</p></div>}
        {dataset.number_rows && dataset.number_rows !== "Unknown" && <div><span className={styles.infoLabel}>데이터 수</span><p>{dataset.number_rows}</p></div>}
      </div>
      {dataset.description && dataset.description !== "Unknown" && (
        <div>
          <h3 className={styles.sectionTitle}>설명</h3>
          <p>{dataset.description}</p>
        </div>
      )}
      {dataset.default && (
        <div>
          <h3 className={styles.sectionTitle}>데이터셋 구조</h3>
          <div className={styles.structureBox}>
            {Object.entries(dataset.default).map(([splitKey, columns]) => (
              <div key={splitKey}>
                <p className={styles.splitKey}>{splitKey}</p>
                {Array.isArray(columns) && (
                  <div className={styles.columns}>
                    {columns.map(col => <span key={col}>{col}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{item?.name}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loadingSpinner}></div>
          ) : !item ? (
            <p>상세 정보를 불러올 수 없습니다.</p>
          ) : (
            type === 'models' ? renderModelDetails() : renderDatasetDetails()
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;