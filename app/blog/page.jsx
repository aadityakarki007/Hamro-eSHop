'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Calendar, Clock, Eye, User, Tag, ArrowRight, Filter, Grid, List, TrendingUp, Star, Heart, Share2, Menu, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HamroEShopBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, sortBy, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        published: 'true',
        sort: sortBy,
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();

      if (data.blogs) {
        setBlogs(data.blogs);
        setPagination(data.pagination);

        // Extract unique categories from blogs for filters
        const uniqueCategories = [
          ...new Set(
            data.blogs
              .map((b) => b.category)
              .filter((c) => c && c.trim() !== '')
          ),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setShowMobileSearch(false);
    // fetchBlogs() is not called directly because useEffect listens to searchTerm change
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No date';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDisplayDate = (blog) => {
    if (blog.published && blog.publishedAt) return formatDate(blog.publishedAt);
    if (blog.createdAt) return formatDate(blog.createdAt);
    if (blog.updatedAt) return formatDate(blog.updatedAt);
    return 'No date';
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    return content.length <= maxLength ? content : content.substring(0, maxLength) + '...';
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = !selectedCategory || blog.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const BlogCard = ({ blog, isListView = false }) => (
    <article
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100 ${
        isListView ? 'flex flex-col sm:flex-row' : ''
      }`}
    >
      {blog.featuredImage && (
        <div
          className={`relative overflow-hidden ${
            isListView ? 'sm:w-1/3 h-48 sm:h-40' : 'h-48 sm:h-56'
          }`}
        >
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full shadow-md">
              {blog.category}
            </span>
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
              <Heart className="h-3 w-3 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <div className={`p-4 sm:p-6 ${isListView ? 'sm:w-2/3 flex flex-col justify-between' : ''}`}>
        <div>
          <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{blog.readTime || 5} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{blog.views || 0}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs">4.8</span>
            </div>
          </div>

          <h2
            className={`font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 ${
              isListView ? 'text-lg sm:text-xl' : 'text-lg'
            }`}
          >
            <a href={`/blog/${blog.slug}`} className="hover:underline">
              {blog.title}
            </a>
          </h2>

          <p
            className={`text-gray-600 mb-3 leading-relaxed line-clamp-3 ${
              isListView ? 'text-sm sm:text-base' : 'text-sm'
            }`}
          >
            {blog.excerpt || truncateContent(blog.content)}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-2 w-2" />
                  <span>{getDisplayDate(blog)}</span>
                </div>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={`tag-${blog._id}-${index}-${tag}`}
                  className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300"
          >
            Read Article
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );

  const EmptyState = () => (
    <div className="text-center py-12 sm:py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
          {searchTerm || selectedCategory
            ? "Try adjusting your search or filter criteria to find what you're looking for."
            : "No blog articles have been published yet. Check back soon for exciting content!"}
        </p>
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Mobile Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Blog</h1>
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="mt-3 pb-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
              <span className="text-blue-200 font-medium text-sm sm:text-base">Hamro eShop BLOG</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Stories & Insights
              </span>
            </h1>
            <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Explore the latest trends, product reviews, and shopping guides to make informed decisions
            </p>

            {/* Desktop Search Bar */}
            <div className="hidden sm:block">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search for articles, topics, or products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-32 py-3 sm:py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300/50 shadow-xl placeholder-gray-400"
                  />
                  <Search className="absolute left-4 top-3.5 sm:top-4.5 h-5 w-5 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Breadcrumb - Hidden on mobile */}
        <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 mb-6 sm:mb-8">
          <a href="/" className="hover:text-blue-600 transition-colors">
            Home
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Blog</span>
        </nav>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedCategory === ''
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category, index) => (
                  <button
                    key={`category-${index}-${category}`}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort & View Controls - Desktop */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label htmlFor="sortBy" className="text-gray-700 text-sm font-medium">
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="mostViewed">Most Viewed</option>
                  <option value="popular">Popular</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading articles...</div>
        ) : filteredBlogs.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id || blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id || blog.slug} blog={blog} isListView />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <nav className="flex justify-center mt-10 space-x-3" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-md border ${
                    currentPage === pageNum
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        )}
      </div>

      <Footer />
    </div>
  );
}
