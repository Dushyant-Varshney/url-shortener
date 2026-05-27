import * as React from 'react';
import FormContainer from '../FormContainer/FormContainer';
import axios from 'axios';
import { serverUrl } from '../../config/api';
import DataTable from '../DataTable/DataTable';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';

const Container = () => {
    const [data, setData] = React.useState([]);
    const [reload, setReload] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const { onUrlClicked } = useSocket();

    const updateReloadState = () => {
        setReload(true);
    };

    const fetchTableData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/shortUrl`);
            setData(response.data || []);
            setReload(false);
        } catch (error) {
            console.error("Error fetching URLs:", error);
            toast.error('Failed to load URLs');
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        fetchTableData();
    }, [reload])

    // Listen for URL click events
    React.useEffect(() => {
        const unsubscribe = onUrlClicked((clickData) => {
            // Update the click count for the URL that was clicked
            // Match both shortUrl AND userId to ensure correct URL is updated
            setData(prevData => 
                prevData.map(url => 
                    url.shortUrl === clickData.shortUrl && url.user === clickData.userId
                        ? { ...url, clicks: clickData.clicks || (url.clicks + 1) }
                        : url
                )
            );
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [onUrlClicked]);

    return (
        <>
            <FormContainer updateReloadState={updateReloadState} />
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='container mx-auto py-16 px-4'
                >
                    <div className='flex justify-center items-center gap-4'>
                        <div className='animate-spin'>
                            <div className='w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full'></div>
                        </div>
                        <span className='text-slate-400'>Loading your links...</span>
                    </div>
                </motion.div>
            )}
            {!isLoading && <DataTable updateReloadState={updateReloadState} data={data} />}
        </>
    );
};

export default Container;
