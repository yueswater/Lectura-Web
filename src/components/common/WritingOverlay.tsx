import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WritingOverlayProps {
    isVisible: boolean;
    message?: string;
}

const WritingOverlay = ({ isVisible, message = "Generating..." }: WritingOverlayProps) => {
    const { t } = useTranslation();
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-base-100/60 backdrop-blur-sm"
                >
                    <div className="relative flex flex-col items-center">
                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-base-300"
                            >
                                <BookOpen size={180} strokeWidth={1} />
                            </motion.div>

                            <motion.div
                                className="absolute top-0 left-0 text-accent"
                                animate={{
                                    x: [30, 140, 50, 130, 80],
                                    y: [50, 70, 90, 110, 130],
                                    rotate: [0, 10, -10, 10, 0],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Pencil size={40} fill="currentColor" />
                            </motion.div>

                            <motion.div
                                className="absolute bottom-12 left-8 h-0.5 bg-accent/30 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: 100 }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 flex flex-col items-center gap-2"
                        >
                            <p className="font-bold text-lg text-base-content/70 tracking-tight text-center">
                                {message}
                            </p>
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-accent"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WritingOverlay;