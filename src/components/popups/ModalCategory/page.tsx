'use client';

import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';

interface ModalDeleteProductRequest {
    isOpen: boolean;
    productCategory: string;
    store: string;
    slug_title_product: string;
    onRequestClose: () => void;
    productLoad: () => void;
}

type CategorysProps = {
    id: string;
    name: string;
    slug: string;
    nivel: number;
    parentId: string | null;
    order: number;
    type_category: string;
    status: string;
    created_at: string;
    updated_at: string;
    children?: CategorysProps[];
};

export function ModalCategory({ isOpen, onRequestClose, productCategory, productLoad, slug_title_product, store }: ModalDeleteProductRequest) {

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'black',
            zIndex: 9999999,
        },
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [categorys, setCategorys] = useState<CategorysProps[]>([]);
    const [registerCategorys, setRegisterCategorys] = useState<any[]>([]);
    const [nameCategory, setNameCategory] = useState<{ name: string; categoryId: string | null }>({ name: '', categoryId: null });
    const [order, setOrder] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<string>("");

    const [toogle, setToogle] = useState(!activeTab);
    const [cor, setCor] = useState('grey');

    useEffect(() => {
        setCor(toogle ? 'red' : '');
    }, [toogle]);

    const handleClick = (id: string) => {
        setActiveTab(id);
        setToogle((state) => !state);
    };

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCategorys() {
            try {
                const { data } = await apiClient.get('/all_categorys');
                setCategorys(data?.all_categorys || []);
                const response = await apiClient.get(`/list_categorys_product?storeProduct_id=${productCategory}`);
                setRegisterCategorys(response.data || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadCategorys();
    }, [productCategory]);

    const handleNameCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [path, categoryId] = event.target.value.split(',');/* @ts-ignore */
        const name = path.split('>').pop().trim();
        setNameCategory({ name, categoryId });
    };

    async function handleRegisterCategory(id: string) {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.post(`/create_category_product`, {
                storeProduct_id: productCategory,
                category_id: nameCategory.categoryId,
                parentId: id,
                name: nameCategory.name,
                order: order,
                slug_title_product: slug_title_product,
                store: store,
            });
            productLoad();
            setLoading(false);
            toast.success("Categoria registrada com sucesso");
        } catch (error) {/* @ts-ignore */
            if (error.response.data?.error === "Categoria já cadastrada nesse produto!") {/* @ts-ignore */
                toast.error(error.response.data?.error);
                setLoading(false);
            } else {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
                toast.error("Erro ao cadastrar esse produto nesta categoria!");
            }
        }
    }

    async function deleteCategoryProduct(id: string, storeProduct_id: string) {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.delete(`/delete_category_product?productCategory_id=${id}&storeProduct_id=${storeProduct_id}`);
            productLoad();
            toast.success("Categoria para esse produto deletada com sucesso.");
            setLoading(false);
            onRequestClose();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);/* @ts-ignore */
            toast.error(`${error.response.data.error}`);
            setLoading(false);
        }
    }

    async function updateOrder(id: string) {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.put(`/update_positionCategory_product?productCategory_id=${id}`, {
                order: order,
            });
            productLoad();
            toast.success("Posição da ordem atualizada com sucesso");
            setLoading(false);
            onRequestClose();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error("Erro ao atualizar a posição");
            setLoading(false);
        }
    }

    const buildCategoryTree = (categories: CategorysProps[], parentId: string | null = null): CategorysProps[] => {
        return categories
            .filter(category => category.parentId === parentId)
            .map(category => ({
                ...category,
                children: buildCategoryTree(categories, category.id),
            }));
    };

    const renderCategoryOptions = (categories: CategorysProps[], parentPath: string = ''): JSX.Element[] => {
        return categories.flatMap(category => {
            const currentPath = parentPath ? `${parentPath} > ${category.name}` : category.name;
            return [
                <option key={category.id} value={`${currentPath},${category.id}`}>
                    {currentPath}
                </option>,
                ...renderCategoryOptions(category.children || [], currentPath),
            ];
        });
    };

    const categoryTree = buildCategoryTree(categorys);


    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            {loading ? (
                <LoadingRequests />
            ) : (
                <>
                    <button
                        type='button'
                        onClick={onRequestClose}
                        className='react-modal-close'
                        style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
                    >
                        <FiX size={45} color="#f34748" />
                    </button>

                    <div className={styles.containerContent}>
                        <h2>Categorias</h2>

                        {registerCategorys?.length === 0 ? (
                            <span className={styles.notFoundCategs}>Sem categorias cadastradas...</span>
                        ) : (
                            <>
                                <strong className={styles.categoryStrong}>Categorias</strong>
                                {registerCategorys.map((item) => (
                                    <ul key={item.name}>
                                        <li className={styles.categs}>
                                            {item.name}
                                            <CiEdit
                                                color={cor}
                                                size={21}
                                                cursor="pointer"
                                                onClick={() => handleClick(item.id)}
                                            />
                                        </li>
                                        {activeTab === item.id && (
                                            <>
                                                <Input
                                                    placeholder={item?.order.toString()}
                                                    type='number'
                                                    value={order ? order : item?.order}/* @ts-ignore */
                                                    onChange={(e) => setOrder(Number(e.target.value))}
                                                />
                                                <Button
                                                    style={{ width: '40%', fontWeight: "bold", fontSize: '14px', backgroundColor: 'green' }}
                                                    onClick={() => updateOrder(item?.id)}
                                                >
                                                    Atualizar posição
                                                </Button>

                                                <h4>Deletar essa categoria desse produto?</h4>

                                                <Button
                                                    style={{ width: '40%', fontWeight: "bold", fontSize: '14px' }}
                                                    onClick={() => deleteCategoryProduct(item?.id, item?.storeProduct_id)}
                                                >
                                                    Deletar
                                                </Button>
                                                <br />
                                                <br />
                                                <hr />
                                                <br />
                                                <br />

                                                <h2>Deseja cadastrar categoria(s)?</h2>

                                                <select
                                                    className={styles.selectImput}
                                                    onChange={handleNameCategory}
                                                >
                                                    <option value="">Selecione as categoria aqui...</option>
                                                    {renderCategoryOptions(categoryTree)}
                                                </select>

                                                <label className={styles.position}>Posição da categoria</label>

                                                <Input
                                                    placeholder="Ordem"
                                                    type='number'
                                                    value={order}/* @ts-ignore */
                                                    onChange={(e) => setOrder(Number(e.target.value))}
                                                />

                                                <button
                                                    className={styles.addCategoryButton}
                                                    onClick={() => handleRegisterCategory(item?.id)}
                                                >
                                                    Cadastrar categoria
                                                </button>
                                            </>
                                        )}
                                    </ul>
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}
        </Modal>
    );
}
