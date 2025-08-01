'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StoreAPI } from '@/app/api/hubAPI';
import ItemDetailModal from '@/app/model/components/hub/ItemDetailModal';
import ItemCard from '@/app/model/components/hub/ItemCard';
import type { StoreItem, ModelItem, DatasetItem } from '@/app/model/components/types';
import styles from '@/app/model/assets/Store.module.scss';

const HubPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'models' | 'datasets'>('models');
  const [items, setItems] = useState<StoreItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [itemDetails, setItemDetails] = useState<StoreItem | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchItems = useCallback(async (type: 'models' | 'datasets') => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await StoreAPI.fetchItems(type);
      if (responseData.status === "success" && Array.isArray(responseData.data)) {
        setItems(responseData.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab, fetchItems]);

  const handleTabChange = (tab: 'models' | 'datasets') => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setSearchQuery('');
      setCurrentPage(1);
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.user_name && item.user_name.toLowerCase().includes(query)) ||
      ('base_model' in item && item.base_model && item.base_model.toLowerCase().includes(query)) ||
      ('training_method' in item && item.training_method && item.training_method.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    return filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleShowDetails = useCallback(async (item: StoreItem) => {
    setIsDetailLoading(true);
    setShowDetailModal(true);
    try {
      if (activeTab === 'datasets') {
        const responseData = await StoreAPI.fetchDatasetDetails(item.name);
        if (responseData.status === "success" && responseData.data) {
          setItemDetails({ ...item, ...responseData.data });
        } else {
          setItemDetails(item);
        }
      } else {
        setItemDetails(item);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsDetailLoading(false);
    }
  }, [activeTab]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
        <nav className={styles.pagination}>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? styles.activePage : ''}
                >
                    {page}
                </button>
            ))}
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                다음
            </button>
        </nav>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
          <div className={styles.headerContent}>
              <h2>모델 훈련 설정</h2>
              <p>모델 훈련을 위한 파라미터를 설정하고 훈련을 시작하세요.</p>
          </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.tabContainer}>
          <button onClick={() => handleTabChange('models')} className={activeTab === 'models' ? styles.activeTab : ''}>
            Model
          </button>
          <button onClick={() => handleTabChange('datasets')} className={activeTab === 'datasets' ? styles.activeTab : ''}>
            Dataset
          </button>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>
        
        <main className={styles.mainContent}>
          {isLoading ? (
            <div className={styles.loadingSpinner}></div>
          ) : error ? (
            <div className={styles.errorBanner}>{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.emptyState}>검색 결과가 없습니다.</div>
          ) : (
            <>
              <div className={styles.gridContainer}>
                {paginatedItems.map(item => (
                  <ItemCard key={item.name} item={item} type={activeTab} onShowDetails={handleShowDetails} />
                ))}
              </div>
              {renderPagination()}
            </>
          )}
        </main>

        <ItemDetailModal
          show={showDetailModal}
          item={itemDetails}
          type={activeTab}
          loading={isDetailLoading}
          onClose={() => setShowDetailModal(false)}
        />
      </div>
    </div>
  );
};

export default HubPage;