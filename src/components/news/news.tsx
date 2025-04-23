import "./news.css";
import { useEffect, useState } from "react";
import axios from "axios";

// function: 뉴스 업로드 시간 계산 함수 //
const getTimeAgo = (uploadTime: string): string => {
  try {
    if (!uploadTime) return "";
    const now = new Date();
    const past = new Date(uploadTime + "+09:00");
    const diff = (now.getTime() - past.getTime()) / 1000;

    if (isNaN(diff) || diff < 0) return "";

    if (diff < 60 * 5) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;

    const hours = Math.floor(diff / 3600);
    return `${hours}시간 전`;
  } catch (e) {
    return "";
  }
};

// interface: 뉴스 항목 타입 정의 //
interface NewsItem {
  title: string;
  summary: string;
  link: string;
  uploadTime: string;
  thumbnail: string;
}

// 카테고리 정의 //
const categories = [
  { label: "정치", value: "politics" },
  { label: "경제", value: "economy" },
  { label: "사회", value: "society" },
  { label: "생활/문화", value: "culture" },
  { label: "세계", value: "world" },
  { label: "IT/과학", value: "it" },
  { label: "랭킹", value: "ranking" },
];

// component: 뉴스 박스 렌더링 //
const News = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ranking");
  const [isLoading, setIsLoading] = useState(false);

  // function: 뉴스 가져오기 //
  const fetchNews = async (category: string = "ranking") => {
    try {
      setIsLoading(true);
      const res = await axios.get<NewsItem[]>(
        `http://localhost:4000/api/news/category?type=${category}`,
      );
      console.log("선택된 카테고리:", category);
      console.log("받은 뉴스 리스트:", res.data);
      setNewsList(res.data);
    } catch (error) {
      console.error("뉴스 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // effect: 카테고리 변경 시 뉴스 새로고침 //
  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  // render: 뉴스 UI 출력 //
  return (
    <div className="news-box">
      <div className="news-header">
        <h3 className="news-title">주요 뉴스</h3>
        <button
          className="refresh-btn"
          onClick={() => fetchNews(selectedCategory)}
        >
          새로고침
        </button>
      </div>

      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`category-btn ${selectedCategory === cat.value ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.value)}
            disabled={isLoading}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="loading">뉴스 불러오는 중...</p>
      ) : newsList.length === 0 ? (
        <p className="empty-news">현재 이 카테고리의 뉴스가 없습니다.</p>
      ) : (
        newsList.map((news, index) => (
          <div key={index} className="news-item">
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-link"
            >
              <div className="news-thumbnail">
                <img src={news.thumbnail} alt="썸네일" />
              </div>
              <div className="news-content">
                <p className="news-headline">{news.title}</p>
                <p className="news-time">{getTimeAgo(news.uploadTime)}</p>
                <p className="news-summary">{news.summary}</p>
              </div>
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default News;
