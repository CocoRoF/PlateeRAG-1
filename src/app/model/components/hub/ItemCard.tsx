// model/components/Store/ItemCard.tsx
import React from 'react';
import Image from 'next/image';
import type { StoreItem, ModelItem, DatasetItem } from '@/app/model/components/types';
import styles from '@/app/model/assets/ItemCard.module.scss';

interface ItemCardProps {
  item: StoreItem;
  type: 'models' | 'datasets';
  onShowDetails: (item: StoreItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, type, onShowDetails }) => {
  const model = type === 'models' ? (item as ModelItem) : null;
  const dataset = type === 'datasets' ? (item as DatasetItem) : null;

  return (
    <div className={styles.card}>
      <div className={styles.thumbnailSection}>
        <Image src={type === 'models' ? '/static/model.png' : '/static/data.png'} alt={type} width={64} height={64} />
      </div>
      <div className={styles.contentSection}>
        <div className={styles.infoWrapper}>
          <h3 className={styles.itemName} title={item.name}>{item.name}</h3>
          <div className={styles.itemDetails}>
            {item.user_name && item.user_name !== "Unknown" && <p>생성자: {item.user_name}</p>}
            {model?.base_model && model.base_model !== "Unknown" && <p title={model.base_model}>베이스 모델: {model.base_model}</p>}
            {model?.training_method && model.training_method !== "Unknown" && <p>학습 방법: {model.training_method}</p>}
            {dataset?.main_task && dataset.main_task !== "Unknown" && <p>주요 작업: {dataset.main_task}</p>}
            {dataset?.number_rows && dataset.number_rows !== "Unknown" && <p>데이터 수: {dataset.number_rows}</p>}
          </div>
          {type === 'models' && model && (
            <div className={styles.badges}>
              {model.use_deepspeed && <span className={styles.deepspeedBadge}>DeepSpeed</span>}
              {model.use_peft && <span className={styles.peftBadge}>PEFT</span>}
              {model.use_flash_attention && <span className={styles.flashAttentionBadge}>Flash Attention</span>}
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={() => onShowDetails(item)} className={styles.detailButton}>
            상세 정보
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;