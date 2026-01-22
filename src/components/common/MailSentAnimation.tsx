import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

interface MailSentAnimationProps {
    isVisible: boolean;
}

const MailSentAnimation = ({ isVisible }: MailSentAnimationProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base-100/90 backdrop-blur-md"
                >
                    <div className="relative">
                        <motion.div
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                                x: [0, 50, 400],
                                y: [0, -50, -400],
                                opacity: [1, 1, 0],
                                scale: [1, 1.1, 0.5]
                            }}
                            transition={{
                                duration: 1.2,
                                ease: "easeIn",
                                times: [0, 0.2, 1]
                            }}
                            className="text-accent"
                        >
                            <Send size={100} strokeWidth={1.5} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-center mt-12"
                        >
                            <div className="flex justify-center mb-4 text-accent/30">
                                <Mail size={40} />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter uppercase">Mail Sent</h3>
                            <p className="opacity-50 font-bold text-xs tracking-[0.3em] mt-2">CHECK YOUR INBOX</p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MailSentAnimation;