import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, MapPin } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-full bg-white flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">页面不存在</h2>
          <p className="text-gray-600 mb-8">
            抱歉，您访问的页面不存在或已被移动。
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full btn btn-primary flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              返回首页
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full btn btn-outline flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回上一页
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;
