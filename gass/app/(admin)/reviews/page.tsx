"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, User, Package, Send, Loader2, CheckCircle2 } from "lucide-react";
import { getAllReviews, replyToReview } from "@/service/review.service";
import storage from "@/utils/storage";

interface IReview {
  review_id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_content: string;
  is_verified_purchase: number;
  created_at: string;
  product_name: string;
  product_code: string;
  reviewer_name: string;
  reply_id?: string;
  reply_content?: string;
  reply_created_at?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const currentUser = storage.getUser();

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const result = await getAllReviews(1, 50);
      if (result?.data) {
        setReviews(result.data);
      }
    } catch (error) {
      console.error("Load reviews error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReply = async (reviewId: string) => {
    if (!replyContent.trim() || !currentUser) return;

    setIsSending(true);
    try {
      await replyToReview(reviewId, currentUser.user_id, replyContent.trim());
      setReplyContent("");
      setReplyingTo(null);
      loadReviews();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={star <= rating ? "fill-black text-black" : "text-gray-100"}
        />
      ))}
    </div>
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-32 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-5xl font-black text-black tracking-tighter flex items-center gap-4 uppercase leading-none">
            Feedback <span className="text-gray-200">/</span> Reviews
          </h1>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Analyzing {reviews.length} customer satisfaction signals
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-32 bg-gray-50 rounded-[3rem] text-center border border-gray-100 border-dashed">
            <MessageSquare size={64} className="mx-auto mb-6 text-gray-200" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">No feedback entries detected in the stream</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {reviews.map((review) => (
            <div key={review.review_id} className="bg-white rounded-[3rem] border border-gray-100 p-10 hover:border-black transition-all duration-500 shadow-sm group">
              <div className="flex flex-col lg:flex-row justify-between gap-10">
                <div className="flex-1 space-y-8">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-500">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight text-black">{review.reviewer_name || "Anonymous Member"}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    {renderStars(review.rating)}
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">{formatDate(review.created_at)}</span>
                                </div>
                            </div>
                        </div>
                        {review.is_verified_purchase === 1 && (
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 italic">
                                <CheckCircle2 size={12} className="text-black" /> Verified Transaction
                            </div>
                        )}
                    </div>

                    {/* Product Context */}
                    <div className="inline-flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
                        <Package size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">{review.product_name}</span>
                        <span className="text-[9px] font-black text-gray-300 font-mono italic">#{review.product_code}</span>
                    </div>

                    {/* Content */}
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-loose italic">
                        "{review.review_content}"
                    </p>

                    {/* Reply Section */}
                    {review.reply_content && (
                        <div className="bg-black text-white p-8 rounded-[2rem] shadow-xl shadow-black/10 animate-in slide-in-from-left duration-700">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-3 italic">Protocol Response</p>
                            <p className="text-[11px] font-black uppercase tracking-widest leading-loose">{review.reply_content}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-4">{formatDate(review.reply_created_at || "")}</p>
                        </div>
                    )}
                </div>

                <div className="lg:w-[350px]">
                    {replyingTo === review.review_id ? (
                        <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-6 border border-gray-100 shadow-inner">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Execute response protocol..."
                                className="w-full p-6 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 ring-black/5 min-h-[150px] resize-none"
                            />
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleReply(review.review_id)}
                                    disabled={isSending || !replyContent.trim()}
                                    className="w-full py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3"
                                >
                                    {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                    Commit Response
                                </button>
                                <button
                                    onClick={() => { setReplyingTo(null); setReplyContent(""); }}
                                    className="w-full py-4 border border-gray-200 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                >
                                    Abort
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setReplyingTo(review.review_id); setReplyContent(review.reply_content || ""); }}
                            className="w-full py-6 border border-gray-100 text-gray-400 rounded-[2rem] hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 group-hover:border-black"
                        >
                            <MessageSquare size={16} />
                            {review.reply_content ? "Edit Response" : "Initiate Protocol"}
                        </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
