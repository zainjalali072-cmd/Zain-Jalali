import React, { useState, useEffect, useMemo, useRef } from "react";
import { BlogPost } from "../types";
import { navigateToRoute } from "../utils/router";
import { saveCMSData, CMSData, cleanHTMLToExcerpt, DEFAULT_POST_IMAGE } from "../cmsStore";
import { 
  Check, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Link2, 
  Code, 
  Share2, 
  Eye, 
  FileText, 
  ImageIcon, 
  Save, 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Clock, 
  User, 
  Tag, 
  Calendar, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Search, 
  HelpCircle, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4,
  List, 
  Quote, 
  Table as TableIcon, 
  Film, 
  Upload, 
  Crop, 
  RotateCcw, 
  RefreshCw, 
  Globe, 
  X, 
  FileDown, 
  CheckCircle2, 
  AlertCircle,
  Sliders,
  Maximize2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layout,
  ListOrdered,
  FileCode,
  HelpCircle as FaqIcon,
  Video,
  Download,
  Minus,
  MessageSquare,
  Code2,
  Grid,
  Layers,
  ArrowUp,
  ArrowDown,
  Edit3
} from "lucide-react";

interface WPSEOEditorProps {
  cmsData: CMSData;
  onSave: (newData: CMSData) => void;
  externalPostId?: string | null;
}

export default function WPSEOEditor({ cmsData, onSave, externalPostId }: WPSEOEditorProps) {
  // 1. Post Selection State
  const posts = cmsData.blogPosts || [];
  const [selectedPostId, setSelectedPostId] = useState<string>(
    externalPostId || (posts.length > 0 ? posts[0].id : "new")
  );

  useEffect(() => {
    if (externalPostId) {
      setSelectedPostId(externalPostId);
    } else if (posts.length > 0 && !selectedPostId) {
      setSelectedPostId(posts[0].id);
    }
  }, [externalPostId, posts]);

  // Current Post loaded
  const currentPostIndex = posts.findIndex((p) => p.id === selectedPostId || p.slug === selectedPostId);
  const activePost = currentPostIndex !== -1 ? posts[currentPostIndex] : null;

  // Local Editable Post State
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(() => {
    if (activePost) return activePost;
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    return {
      id: `post-${Date.now()}`,
      title: "",
      excerpt: "",
      content: "<p>Start writing your article here...</p>",
      category: "Tajweed Rules",
      coverImage: "",
      featuredImage: "",
      author: {
        name: "Muhammad Zain",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        role: "Senior Quran Scholar"
      },
      date: today,
      readTime: "5 min read",
      tags: ["Tajweed Rules"],
      status: "published",
      slug: "new-article"
    };
  });

  useEffect(() => {
    if (selectedPostId === "new" || externalPostId === "new") {
      const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      setCurrentPost({
        id: `post-${Date.now()}`,
        title: "",
        excerpt: "",
        content: "<p>Start writing your article here...</p>",
        category: "Tajweed Rules",
        coverImage: "",
        featuredImage: "",
        author: {
          name: "Muhammad Zain",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          role: "Senior Quran Scholar"
        },
        date: today,
        readTime: "5 min read",
        tags: ["Tajweed Rules"],
        status: "published",
        slug: "new-article"
      });
    } else if (activePost) {
      setCurrentPost({
        ...activePost,
        status: activePost.status || "published",
        title: activePost.title || "",
        content: activePost.content || "",
        excerpt: activePost.excerpt || "",
        category: activePost.category || "Tajweed Rules",
        date: activePost.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readTime: activePost.readTime || "5 min read",
        author: {
          name: activePost.author?.name || "Muhammad Zain",
          avatar: activePost.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          role: activePost.author?.role || "Senior Quran Scholar"
        },
        tags: activePost.tags || ["Tajweed Rules"],
        metaTitle: activePost.metaTitle || activePost.title || "",
        metaDescription: activePost.metaDescription || activePost.excerpt || "",
        focusKeyword: activePost.focusKeyword || "",
        slug: activePost.slug || activePost.id || "post-slug",
        robotsMeta: activePost.robotsMeta || "index, follow",
        ogTitle: activePost.ogTitle || activePost.title || "",
        ogDescription: activePost.ogDescription || activePost.excerpt || "",
        ogImage: activePost.ogImage || activePost.coverImage || "",
        twitterTitle: activePost.twitterTitle || activePost.title || "",
        twitterDescription: activePost.twitterDescription || activePost.excerpt || "",
        twitterCard: activePost.twitterCard || "summary_large_image",
        coverImage: activePost.coverImage || "",
        featuredImage: activePost.featuredImage || activePost.coverImage || "",
        imageAltText: activePost.imageAltText || "",
        imageTitle: activePost.imageTitle || "",
        imageCaption: activePost.imageCaption || "",
        imageDescription: activePost.imageDescription || "",
        imageFileName: activePost.imageFileName || "",
        internalLinksCount: activePost.internalLinksCount !== undefined ? activePost.internalLinksCount : 0,
        externalLinksCount: activePost.externalLinksCount !== undefined ? activePost.externalLinksCount : 0,
        schemaType: activePost.schemaType || "Article",
        customSchemaJson: activePost.customSchemaJson || ""
      });
    }
  }, [selectedPostId, posts.length]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // View / Device mode (desktop, tablet, mobile)
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Dual Editor Mode (Visual vs HTML Code)
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");

  // Accordions open states in sidebar
  const [expandedSections, setExpandedSections] = useState({
    meta: true,
    imageSeo: true,
    links: false,
    schema: false,
    social: false,
    publishing: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Modals state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashSearch, setSlashSearch] = useState("");
  const [activeBlockCategory, setActiveBlockCategory] = useState<"all" | "text" | "media" | "layout" | "design" | "embed" | "seo">("all");

  // Interactive Block Builder Modals
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHasHeader, setTableHasHeader] = useState(true);
  const [tableStyle, setTableStyle] = useState<"gold" | "dark" | "emerald">("gold");

  const [showButtonModal, setShowButtonModal] = useState(false);
  const [buttonText, setButtonText] = useState("Start Free Trial");
  const [buttonUrl, setButtonUrl] = useState("https://wa.me/+923219347471");
  const [buttonStyle, setButtonStyle] = useState<"gold" | "outline" | "emerald" | "blue" | "dark">("gold");
  const [buttonSize, setButtonSize] = useState<"sm" | "md" | "lg">("md");
  const [buttonAlign, setButtonAlign] = useState<"left" | "center" | "right">("center");
  const [buttonTargetBlank, setButtonTargetBlank] = useState(true);

  const [showFaqModal, setShowFaqModal] = useState(false);
  const [faqItems, setFaqItems] = useState([
    { question: "Who are the instructors at Truth Quran Academy?", answer: "Our instructors are certified Huffadh and scholars from Jamia Naeemia Lahore with years of online teaching experience." },
    { question: "What age groups do you teach?", answer: "We offer tailored programs for children (ages 4+), teenagers, adults, and beginners of all ages." }
  ]);
  const [faqIncludeSchema, setFaqIncludeSchema] = useState(true);

  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedType, setEmbedType] = useState<"youtube" | "vimeo" | "googlemaps" | "custom">("youtube");
  const [embedUrl, setEmbedUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");

  const [showCtaModal, setShowCtaModal] = useState(false);
  const [ctaTitle, setCtaTitle] = useState("Master Quran Recitation with Certified Scholars");
  const [ctaDesc, setCtaDesc] = useState("Schedule a 100% free 30-minute evaluation session with expert teachers from Jamia Naeemia Lahore.");
  const [ctaBtnText, setCtaBtnText] = useState("Book Free Trial on WhatsApp");
  const [ctaBtnUrl, setCtaBtnUrl] = useState("https://wa.me/+923219347471");

  // History stack for Undo / Redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const pushHistory = (newContent: string) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newContent];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevContent = history[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      if (currentPost) {
        setCurrentPost({ ...currentPost, content: prevContent });
      }
      showToast("Undo applied");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextContent = history[historyIndex + 1];
      setHistoryIndex((prev) => prev + 1);
      if (currentPost) {
        setCurrentPost({ ...currentPost, content: nextContent });
      }
      showToast("Redo applied");
    }
  };

  const [showInternalLinkModal, setShowInternalLinkModal] = useState(false);
  const [internalLinkSearch, setInternalLinkSearch] = useState("");
  const [internalLinkTab, setInternalLinkTab] = useState<"posts" | "pages" | "courses">("posts");

  const [showExternalLinkModal, setShowExternalLinkModal] = useState(false);
  const [extLinkUrl, setExtLinkUrl] = useState("https://");
  const [extLinkText, setExtLinkText] = useState("External Reference");

  // Internal Images Manager Modal State
  const [showInternalImagesModal, setShowInternalImagesModal] = useState(false);
  const [internalImgSearch, setInternalImgSearch] = useState("");
  const [selectedInternalImages, setSelectedInternalImages] = useState<string[]>([]);
  const [imgAlign, setImgAlign] = useState<"left" | "center" | "right">("center");
  const [imgWidth, setImgWidth] = useState<string>("100%");
  const [imgAltText, setImgAltText] = useState<string>("");
  const [imgCaptionText, setImgCaptionText] = useState<string>("");
  const [imgTitleText, setImgTitleText] = useState<string>("");

  // Media Library Upload Modal
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"featured" | "internal">("featured");

  // 3:2 Featured Image Cropper & Optimization Studio State
  const [showCropModal, setShowCropModal] = useState(false);
  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState(1.0);
  const [cropPanX, setCropPanX] = useState(0);
  const [cropPanY, setCropPanY] = useState(0);
  const [cropBrightness, setCropBrightness] = useState(100);
  const [cropContrast, setCropContrast] = useState(100);
  const [cropSaturation, setCropSaturation] = useState(100);
  const [cropAspectRatio, setCropAspectRatio] = useState<"3:2" | "16:9" | "1:1" | "4:3">("3:2");
  const [cropQuality, setCropQuality] = useState(0.88);
  const [imageNaturalDims, setImageNaturalDims] = useState<{ width: number; height: number } | null>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  // Social Sharing & SERP preview tabs
  const [previewTab, setPreviewTab] = useState<"google" | "facebook" | "twitter">("google");

  const featuredFileInputRef = useRef<HTMLInputElement>(null);
  const internalFileInputRef = useRef<HTMLInputElement>(null);

  // Measure natural dimensions of active cover image
  useEffect(() => {
    const activeCover = currentPost?.coverImage || currentPost?.featuredImage;
    if (activeCover) {
      const img = new Image();
      img.src = activeCover;
      img.onload = () => {
        setImageNaturalDims({ width: img.naturalWidth, height: img.naturalHeight });
      };
    } else {
      setImageNaturalDims(null);
    }
  }, [currentPost?.coverImage, currentPost?.featuredImage]);

  // Quick auto-crop reset to 3:2 centered
  const handleQuickAutoCrop3by2 = () => {
    setCropScale(1.0);
    setCropPanX(0);
    setCropPanY(0);
    setCropBrightness(100);
    setCropContrast(100);
    setCropSaturation(100);
    setCropAspectRatio("3:2");
    showToast("Reset to standard 3:2 (1200 × 800 px) centered crop.");
  };

  // High-performance canvas crop & Web optimization (1200 × 800 px export)
  const handleApplyCropAndOptimize = () => {
    const imgSrc = pendingCropImage || currentPost?.originalCoverImage || currentPost?.coverImage;
    if (!imgSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
    img.onload = () => {
      let targetWidth = 1200;
      let targetHeight = 800;

      if (cropAspectRatio === "16:9") {
        targetWidth = 1200;
        targetHeight = 675;
      } else if (cropAspectRatio === "1:1") {
        targetWidth = 800;
        targetHeight = 800;
      } else if (cropAspectRatio === "4:3") {
        targetWidth = 1200;
        targetHeight = 900;
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.filter = `brightness(${cropBrightness}%) contrast(${cropContrast}%) saturate(${cropSaturation}%)`;

      ctx.fillStyle = "#07080b";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const targetRatio = targetWidth / targetHeight;

      let drawWidth = targetWidth * cropScale;
      let drawHeight = (targetWidth / imgRatio) * cropScale;

      if (imgRatio < targetRatio) {
        drawHeight = targetHeight * cropScale;
        drawWidth = (targetHeight * imgRatio) * cropScale;
      }

      const offsetX = (targetWidth - drawWidth) / 2 + (cropPanX / 100) * targetWidth;
      const offsetY = (targetHeight - drawHeight) / 2 + (cropPanY / 100) * targetHeight;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      const optimizedDataUrl = canvas.toDataURL("image/jpeg", cropQuality);

      handleUpdateField("coverImage", optimizedDataUrl);
      handleUpdateField("featuredImage", optimizedDataUrl);
      handleUpdateField("ogImage", optimizedDataUrl);
      handleUpdateField("imageWidth", targetWidth);
      handleUpdateField("imageHeight", targetHeight);
      handleUpdateField("imageAspectRatio", cropAspectRatio);

      if (pendingCropImage && pendingCropImage !== currentPost?.originalCoverImage) {
        handleUpdateField("originalCoverImage", pendingCropImage);
      } else if (!currentPost?.originalCoverImage) {
        handleUpdateField("originalCoverImage", imgSrc);
      }

      setShowCropModal(false);
      setPendingCropImage(null);
      showToast(`Featured image optimized & saved at ${targetWidth} × ${targetHeight} px (3:2 Ratio)!`);
    };
  };

  // Field updater
  const handleUpdateField = (field: keyof BlogPost, value: any) => {
    if (!currentPost) return;
    setCurrentPost((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // 2. Dynamic Content Analysis Engine
  const contentStats = useMemo(() => {
    if (!currentPost) return { words: 0, sentences: 0, paragraphs: 0, readingTime: "0 min" };
    const htmlContent = currentPost.content || "";
    const stripped = htmlContent.replace(/<[^>]*>/g, " ");
    const wordList = stripped.trim() ? stripped.trim().split(/\s+/).filter(Boolean) : [];
    const words = wordList.length;
    const sentenceList = stripped.split(/[.!?]+/).filter((s) => s.trim().length > 2);
    const sentences = sentenceList.length || 0;
    const pList = htmlContent.split(/<\/p>|<br\s*\/?>|\n\n+/).filter((p) => p.trim().length > 0);
    const paragraphs = pList.length || 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      sentences,
      paragraphs,
      readingTime: `${readTimeMinutes} min read`
    };
  }, [currentPost?.content]);

  // 3. REAL-TIME RANK MATH PRO SEO SCORE ENGINE (Starts from 0% for new/unoptimized posts)
  const seoAnalysis = useMemo(() => {
    if (!currentPost) {
      return {
        score: 0,
        readability: 0,
        keywordDensity: 0,
        rules: [],
        passedCount: 0,
        failedCount: 0,
        recommendations: []
      };
    }

    const keyword = (currentPost.focusKeyword || "").trim().toLowerCase();
    const title = (currentPost.title || "").trim();
    const titleLower = title.toLowerCase();
    const metaTitle = (currentPost.metaTitle || "").trim().toLowerCase();
    const metaDesc = (currentPost.metaDescription || "").trim();
    const metaDescLower = metaDesc.toLowerCase();
    const slug = (currentPost.slug || "").trim().toLowerCase();
    const htmlContent = (currentPost.content || "").trim();
    const htmlContentLower = htmlContent.toLowerCase();
    const plainText = htmlContent.replace(/<[^>]*>/g, " ");
    const plainTextLower = plainText.toLowerCase();

    const words = contentStats.words;
    let rules: Array<{ id: string; label: string; category: string; passed: boolean; feedback: string; points: number }> = [];

    // Rule 1: Focus Keyword Defined
    const hasKeyword = keyword.length >= 2;
    rules.push({
      id: "has_keyword",
      label: "Focus Keyword Defined",
      category: "Basic SEO",
      passed: hasKeyword,
      feedback: hasKeyword ? `Target keyword set to "${keyword}".` : "Specify a focus keyword for Rank Math analysis.",
      points: 10
    });

    // Rule 2: Focus Keyword in Post Title
    const kwInTitle = hasKeyword ? titleLower.includes(keyword) || metaTitle.includes(keyword) : false;
    rules.push({
      id: "kw_title",
      label: "Focus Keyword in Title",
      category: "Basic SEO",
      passed: kwInTitle,
      feedback: kwInTitle ? "Focus keyword appears in post title." : "Include your focus keyword in the article title.",
      points: 10
    });

    // Rule 3: Focus Keyword in Permalink Slug
    const kwInSlug = hasKeyword ? slug.includes(keyword.replace(/\s+/g, "-")) || slug.includes(keyword) : false;
    rules.push({
      id: "kw_slug",
      label: "Focus Keyword in URL / Slug",
      category: "Basic SEO",
      passed: kwInSlug,
      feedback: kwInSlug ? "Permalink slug contains focus keyword." : "Include focus keyword in the URL slug.",
      points: 10
    });

    // Rule 4: Focus Keyword in Meta Description
    const kwInDesc = hasKeyword ? metaDescLower.includes(keyword) : false;
    rules.push({
      id: "kw_desc",
      label: "Focus Keyword in Meta Description",
      category: "Basic SEO",
      passed: kwInDesc,
      feedback: kwInDesc ? "Focus keyword found in meta description." : "Add focus keyword to the meta description.",
      points: 10
    });

    // Rule 5: Focus Keyword in First 10% Content / First Paragraph
    const firstPart = plainTextLower.slice(0, Math.max(200, Math.floor(plainTextLower.length * 0.15)));
    const kwInFirst = hasKeyword ? firstPart.includes(keyword) : false;
    rules.push({
      id: "kw_first_paragraph",
      label: "Focus Keyword in First Paragraph",
      category: "Basic SEO",
      passed: kwInFirst,
      feedback: kwInFirst ? "Focus keyword appears early in opening paragraph." : "Mention focus keyword in the first paragraph.",
      points: 10
    });

    // Rule 6: Focus Keyword in Subheadings (H2, H3)
    const headingsText = (htmlContent.match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi) || []).join(" ").toLowerCase();
    const kwInHeadings = hasKeyword ? headingsText.includes(keyword) : false;
    rules.push({
      id: "kw_headings",
      label: "Focus Keyword in Subheadings (H2/H3)",
      category: "Content Readability",
      passed: kwInHeadings,
      feedback: kwInHeadings ? "Focus keyword used inside H2/H3 subheadings." : "Use focus keyword in at least one H2/H3 subheading.",
      points: 8
    });

    // Rule 7: Keyword Density (0.5% - 2.5%)
    let kwOccurrences = 0;
    if (hasKeyword && words > 0) {
      const regex = new RegExp(`\\b${keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "gi");
      kwOccurrences = (plainText.match(regex) || []).length;
    }
    const keywordDensity = words > 0 && hasKeyword ? (kwOccurrences / words) * 100 : 0;
    const kwDensityPassed = keywordDensity >= 0.5 && keywordDensity <= 2.5;
    rules.push({
      id: "kw_density",
      label: "Keyword Density (0.5% - 2.5%)",
      category: "Additional SEO",
      passed: kwDensityPassed,
      feedback: kwDensityPassed 
        ? `Keyword density is optimal (${keywordDensity.toFixed(2)}%).`
        : keywordDensity === 0 
          ? "Focus keyword does not appear in body content."
          : `Keyword density is ${keywordDensity.toFixed(2)}% (Target: 0.5% - 2.5%).`,
      points: 10
    });

    // Rule 8: Word Count >= 300 words
    const lengthPassed = words >= 300;
    rules.push({
      id: "word_count",
      label: "Content Length (300+ Words)",
      category: "Basic SEO",
      passed: lengthPassed,
      feedback: lengthPassed 
        ? `Content is ${words} words long.` 
        : `Content is only ${words} words. Aim for at least 300-600 words.`,
      points: 10
    });

    // Rule 9: Featured Image Set, Alt Text & 3:2 Ratio Standard (1200x800)
    const imageSet = Boolean(currentPost.coverImage || currentPost.featuredImage);
    const altSet = (currentPost.imageAltText || "").trim().length > 3;
    const is3by2Standard = imageNaturalDims ? (imageNaturalDims.width >= 1000 && Math.abs((imageNaturalDims.width / imageNaturalDims.height) - 1.5) < 0.1) : true;
    const imgPassed = imageSet && altSet && is3by2Standard;
    
    rules.push({
      id: "featured_image",
      label: "Featured Image (1200×800 px, 3:2 Ratio)",
      category: "Additional SEO",
      passed: imgPassed,
      feedback: imgPassed 
        ? "Featured image set with ALT text & verified 1200 × 800 px (3:2 Ratio) Rank Math standard." 
        : !imageSet
          ? "Set a featured image for search engines & social previews."
          : !altSet
            ? "Add descriptive ALT text to the featured image."
            : "Featured image aspect ratio/size should be optimized to 1200 × 800 pixels (3:2 ratio).",
      points: 8
    });

    // Rule 10: Internal Links Present
    const internalLinks = currentPost.internalLinksCount || 0;
    const internalPassed = internalLinks >= 1 || /href=["']\//i.test(htmlContent) || /truthquranacademy\.com/i.test(htmlContent);
    rules.push({
      id: "internal_links",
      label: "Internal Linking Present",
      category: "Additional SEO",
      passed: internalPassed,
      feedback: internalPassed ? "Internal links found pointing to Academy resources." : "Include at least one internal link to another page.",
      points: 7
    });

    // Rule 11: External Links Present
    const externalLinks = currentPost.externalLinksCount || 0;
    const externalPassed = externalLinks >= 1 || /href=["']http/i.test(htmlContent);
    rules.push({
      id: "external_links",
      label: "Outbound External Links",
      category: "Additional SEO",
      passed: externalPassed,
      feedback: externalPassed ? "Outbound external references included." : "Include an external reference link.",
      points: 5
    });

    // Rule 12: Title Length (40 - 60 Chars)
    const titleLen = title.length;
    const titleLenPassed = titleLen >= 30 && titleLen <= 65;
    rules.push({
      id: "title_length",
      label: "Title Length (30 - 65 Chars)",
      category: "Title Readability",
      passed: titleLenPassed,
      feedback: titleLenPassed ? `Title is ${titleLen} characters (Optimal).` : `Title is ${titleLen} characters (Target: 30-65 chars).`,
      points: 4
    });

    // Rule 13: Meta Description Length (100 - 160 Chars)
    const descLen = metaDesc.length;
    const descLenPassed = descLen >= 90 && descLen <= 160;
    rules.push({
      id: "desc_length",
      label: "Meta Description Length (90 - 160 Chars)",
      category: "Title Readability",
      passed: descLenPassed,
      feedback: descLenPassed ? `Meta description is ${descLen} characters (Optimal).` : `Meta description is ${descLen} characters (Target: 90-160 chars).`,
      points: 4
    });

    // Rule 14: Schema Markup Configured
    const schemaSet = Boolean(currentPost.schemaType || currentPost.customSchemaJson);
    rules.push({
      id: "schema_markup",
      label: "Schema Structured Data",
      category: "Additional SEO",
      passed: schemaSet,
      feedback: schemaSet ? `Schema set to ${currentPost.schemaType || "Article"}.` : "Configure Schema markup.",
      points: 4
    });

    // Compute exact total score
    const totalAchieved = rules.reduce((acc, r) => acc + (r.passed ? r.points : 0), 0);
    const totalMax = rules.reduce((acc, r) => acc + r.points, 0);
    const overallScore = Math.min(100, Math.round((totalAchieved / totalMax) * 100));

    // Readability Score
    const wordsPerSentence = words / Math.max(1, contentStats.sentences);
    const readability = Math.max(0, Math.min(100, Math.round(100 - (wordsPerSentence * 1.8))));

    const passedCount = rules.filter((r) => r.passed).length;
    const failedCount = rules.filter((r) => !r.passed).length;
    const recommendations = rules.filter((r) => !r.passed).map((r) => r.feedback);

    return {
      score: overallScore,
      readability,
      keywordDensity,
      rules,
      passedCount,
      failedCount,
      recommendations
    };
  }, [currentPost, contentStats]);

  // Save current post
  const handleSaveArticle = (statusOverride?: "published" | "draft" | "scheduled") => {
    if (!currentPost) return;

    const newStatus = statusOverride || currentPost.status || "published";
    const postTitle = (currentPost.title || "").trim() || "Untitled Article";
    const postSlug = (currentPost.slug || "").trim() || postTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const cleanExcerpt = cleanHTMLToExcerpt(currentPost.content || "", currentPost.excerpt);
    const validImage = currentPost.coverImage || currentPost.featuredImage || currentPost.ogImage || DEFAULT_POST_IMAGE;
    const todayFormatted = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const updatedPost: BlogPost = {
      ...currentPost,
      title: postTitle,
      slug: postSlug,
      excerpt: cleanExcerpt,
      coverImage: validImage,
      featuredImage: validImage,
      ogImage: currentPost.ogImage || validImage,
      category: currentPost.category || "Tajweed Rules",
      date: currentPost.date || todayFormatted,
      readTime: currentPost.readTime || contentStats.readingTime || "5 min read",
      author: {
        name: currentPost.author?.name || "Muhammad Zain",
        avatar: currentPost.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        role: currentPost.author?.role || "Senior Quran Scholar"
      },
      tags: currentPost.tags && currentPost.tags.length > 0 ? currentPost.tags : ["Tajweed Rules"],
      status: newStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
      wordCount: contentStats.words,
      sentenceCount: contentStats.sentences,
      paragraphCount: contentStats.paragraphs,
      seoScore: seoAnalysis.score
    };

    let updatedPosts = [...posts];
    const existingIndex = updatedPosts.findIndex((p) => p.id === currentPost.id || (p.slug && p.slug === postSlug));

    if (existingIndex !== -1) {
      // Remove old position and place updated post at index 0 so newest published article appears first!
      updatedPosts.splice(existingIndex, 1);
      updatedPosts.unshift(updatedPost);
    } else {
      updatedPosts.unshift(updatedPost);
    }

    const updatedCMSData: CMSData = {
      ...cmsData,
      blogPosts: updatedPosts
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    setCurrentPost(updatedPost);
    setSelectedPostId(updatedPost.id);
    showToast(`Article "${updatedPost.title}" ${newStatus === "published" ? "published live" : "saved"} successfully!`);
  };

  // Create brand new draft article (Starts at 0% SEO Score until user writes content!)
  const handleCreateNewPost = () => {
    const newId = `post-${Date.now()}`;
    const newPost: BlogPost = {
      id: newId,
      title: "New Quran & Tajweed Guide",
      excerpt: "",
      category: "Tajweed Rules",
      coverImage: "",
      author: {
        name: "Muhammad Zain",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        role: "Senior Quran Scholar"
      },
      date: new Date().toISOString().split("T")[0],
      readTime: "1 min read",
      tags: ["Tajweed"],
      content: "<p>Start writing your article here...</p>",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      slug: `new-article-${Date.now().toString().slice(-4)}`,
      canonicalUrl: `https://truthquranacademy.com/blog/new-article-${Date.now().toString().slice(-4)}/`,
      robotsMeta: "index, follow",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      imageAltText: "",
      internalLinksCount: 0,
      externalLinksCount: 0,
      schemaType: "Article",
      seoScore: 0
    };

    const updatedCMSData = {
      ...cmsData,
      blogPosts: [newPost, ...posts]
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    setSelectedPostId(newId);
    setCurrentPost(newPost);
    showToast("New blank draft initialized (SEO Score: 0%).");
  };

  // Delete current post
  const handleDeletePost = () => {
    if (!currentPost) return;
    if (!window.confirm(`Are you sure you want to delete "${currentPost.title}"?`)) return;

    const remaining = posts.filter((p) => p.id !== currentPost.id);
    const updatedCMSData = {
      ...cmsData,
      blogPosts: remaining
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    if (remaining.length > 0) {
      setSelectedPostId(remaining[0].id);
      setCurrentPost(remaining[0]);
    } else {
      setSelectedPostId("");
      setCurrentPost(null);
    }
    showToast("Post deleted from database.");
  };

  // Insert Block or HTML content into editor
  const handleInsertBlockHtml = (blockHtml: string) => {
    if (!currentPost) return;
    const updatedContent = `${currentPost.content || ""}\n${blockHtml}`;
    handleUpdateField("content", updatedContent);
    pushHistory(updatedContent);
    setShowSlashMenu(false);
    showToast("Block inserted into post!");
  };

  // Rich Text Formatting Helpers
  const applyFormattingToSelection = (openTag: string, closeTag: string, defaultText = "formatted text") => {
    if (!currentPost) return;
    const textarea = document.getElementById("gutenberg-content-textarea") as HTMLTextAreaElement | null;
    const content = currentPost.content || "";

    if (textarea && textarea.selectionStart !== undefined && textarea.selectionEnd !== undefined && textarea.selectionStart !== textarea.selectionEnd) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + openTag + selectedText + closeTag + content.substring(end);
      handleUpdateField("content", newContent);
      pushHistory(newContent);
      showToast(`Formatting applied to selection!`);
    } else {
      const newContent = content + `\n${openTag}${defaultText}${closeTag}`;
      handleUpdateField("content", newContent);
      pushHistory(newContent);
      showToast(`Inserted formatted element!`);
    }
  };

  const applyHeadingToSelection = (level: "h1" | "h2" | "h3" | "h4") => {
    const defaultText = level === "h1" ? "Main Article Title" : level === "h2" ? "Section Subheading" : "Sub-point Heading";
    applyFormattingToSelection(`<${level} class="font-serif text-xl font-bold text-white my-4">`, `</${level}>`, defaultText);
  };

  const applyColorToSelection = (colorHex: string, label: string) => {
    applyFormattingToSelection(`<span style="color: ${colorHex}">`, `</span>`, `${label} Text`);
  };

  const clearFormattingSelection = () => {
    if (!currentPost) return;
    const textarea = document.getElementById("gutenberg-content-textarea") as HTMLTextAreaElement | null;
    const content = currentPost.content || "";
    if (textarea && textarea.selectionStart !== undefined && textarea.selectionEnd !== undefined && textarea.selectionStart !== textarea.selectionEnd) {
      const selected = content.substring(textarea.selectionStart, textarea.selectionEnd);
      const stripped = selected.replace(/<[^>]*>/g, "");
      const newContent = content.substring(0, textarea.selectionStart) + stripped + content.substring(textarea.selectionEnd);
      handleUpdateField("content", newContent);
      pushHistory(newContent);
      showToast("Formatting cleared from selected text!");
    } else {
      const stripped = content.replace(/<[^>]*>/g, "");
      handleUpdateField("content", stripped);
      pushHistory(stripped);
      showToast("All HTML formatting cleared!");
    }
  };

  // Interactive Block Builders
  const handleInsertCustomTable = () => {
    let headerHtml = "";
    if (tableHasHeader) {
      headerHtml = `<thead class="bg-[#d9b45c]/20 text-[#f2d98a] font-bold"><tr>`;
      for (let c = 1; c <= tableCols; c++) {
        headerHtml += `<th class="p-3 border-b border-[#d9b45c]/30">Header ${c}</th>`;
      }
      headerHtml += `</tr></thead>`;
    }

    let rowsHtml = "";
    for (let r = 1; r <= tableRows; r++) {
      rowsHtml += `<tr class="${r % 2 === 0 ? "bg-white/5" : ""}">`;
      for (let c = 1; c <= tableCols; c++) {
        rowsHtml += `<td class="p-3 border-b border-white/5 text-[#c9c2ab]">Data ${r}-${c}</td>`;
      }
      rowsHtml += `</tr>`;
    }

    const tableClass = tableStyle === "gold" ? "border-[#d9b45c]/30" : tableStyle === "emerald" ? "border-emerald-500/30" : "border-white/10";

    const fullTable = `
<div class="overflow-x-auto my-6">
  <table class="w-full text-left text-xs border ${tableClass} rounded-2xl overflow-hidden bg-[#12141b]">
    ${headerHtml}
    <tbody class="divide-y divide-white/5">
      ${rowsHtml}
    </tbody>
  </table>
</div>`;

    handleInsertBlockHtml(fullTable);
    setShowTableModal(false);
  };

  const handleInsertCustomButton = () => {
    const styleClass = 
      buttonStyle === "gold" ? "bg-[#d9b45c] text-black hover:bg-[#f2d98a]" :
      buttonStyle === "emerald" ? "bg-emerald-500 text-black hover:bg-emerald-400" :
      buttonStyle === "blue" ? "bg-blue-500 text-white hover:bg-blue-400" :
      buttonStyle === "outline" ? "border-2 border-[#d9b45c] text-[#f2d98a] hover:bg-[#d9b45c] hover:text-black" :
      "bg-[#12141b] text-white border border-white/20 hover:bg-white/10";

    const sizeClass = buttonSize === "sm" ? "px-4 py-2 text-xs" : buttonSize === "lg" ? "px-8 py-4 text-sm font-extrabold" : "px-6 py-3 text-xs font-bold";

    const btnHtml = `
<div class="my-6 text-${buttonAlign}">
  <a href="${buttonUrl}" ${buttonTargetBlank ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center space-x-2 ${styleClass} ${sizeClass} rounded-full transition-all shadow-xl font-sans uppercase tracking-wider">
    <span>${buttonText} →</span>
  </a>
</div>`;

    handleInsertBlockHtml(btnHtml);
    setShowButtonModal(false);
  };

  const handleInsertCustomFaq = () => {
    let faqAccordionHtml = `<div class="space-y-3 my-8"><h3 class="text-lg font-serif font-bold text-white mb-4">Frequently Asked Questions</h3>`;
    let faqSchemaObj: any = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": []
    };

    faqItems.forEach((item) => {
      faqAccordionHtml += `
<details class="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-4 cursor-pointer group transition-all">
  <summary class="font-bold text-xs text-[#f2d98a] flex items-center justify-between list-none">
    <span>${item.question}</span>
    <span class="text-[#d9b45c] text-xs group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p class="text-xs text-[#c9c2ab] mt-3 leading-relaxed border-t border-white/5 pt-3">${item.answer}</p>
</details>`;

      if (faqIncludeSchema) {
        faqSchemaObj.mainEntity.push({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        });
      }
    });

    faqAccordionHtml += `</div>`;

    if (faqIncludeSchema) {
      faqAccordionHtml += `\n<script type="application/ld+json">\n${JSON.stringify(faqSchemaObj, null, 2)}\n</script>`;
    }

    handleInsertBlockHtml(faqAccordionHtml);
    setShowFaqModal(false);
  };

  const handleInsertCustomEmbed = () => {
    let embedContainer = "";
    if (embedType === "youtube" || embedType === "vimeo") {
      let srcUrl = embedUrl;
      if (embedType === "youtube" && !embedUrl.includes("embed")) {
        const match = embedUrl.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (match) srcUrl = `https://www.youtube.com/embed/${match[1]}`;
      }
      embedContainer = `
<div class="relative w-full aspect-video rounded-2xl overflow-hidden my-6 border border-[#d9b45c]/30 shadow-2xl">
  <iframe class="absolute inset-0 w-full h-full" src="${srcUrl}" title="Embedded Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;
    } else if (embedType === "googlemaps") {
      embedContainer = `
<div class="relative w-full h-80 rounded-2xl overflow-hidden my-6 border border-[#d9b45c]/30 shadow-2xl">
  <iframe class="w-full h-full" src="${embedUrl}" title="Google Map Embed" loading="lazy"></iframe>
</div>`;
    } else {
      embedContainer = `
<div class="custom-embed-block my-6 p-4 bg-[#07080b] border border-white/10 rounded-2xl overflow-x-auto">
  ${embedUrl}
</div>`;
    }

    handleInsertBlockHtml(embedContainer);
    setShowEmbedModal(false);
  };

  const handleInsertCustomCta = () => {
    const ctaHtml = `
<div class="my-8 p-6 md:p-8 bg-gradient-to-br from-[#12141b] via-[#1e2230] to-[#07080b] border-2 border-[#d9b45c]/40 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
  <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f2d98a] via-[#d9b45c] to-[#b38f3b]"></div>
  <h3 class="font-serif text-xl md:text-2xl font-bold text-white max-w-xl mx-auto">${ctaTitle}</h3>
  <p class="text-xs md:text-sm text-[#c9c2ab] max-w-lg mx-auto leading-relaxed">${ctaDesc}</p>
  <div class="pt-2">
    <a href="${ctaBtnUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#d9b45c] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-[#f2d98a] transition-all shadow-xl hover:scale-105">
      <span>${ctaBtnText} →</span>
    </a>
  </div>
</div>`;

    handleInsertBlockHtml(ctaHtml);
    setShowCtaModal(false);
  };

  // 4. COMPLETE GUTENBERG BLOCK LIBRARY (Categorized)
  const slashCommands = [
    // TEXT BLOCKS
    {
      id: "paragraph",
      title: "/paragraph",
      label: "Paragraph Text",
      category: "text" as const,
      desc: "Standard body text block with clean typography",
      icon: <FileText size={16} className="text-[#d9b45c]" />,
      action: () => handleInsertBlockHtml(`<p class="my-4 text-xs md:text-sm text-[#c9c2ab] leading-relaxed">Write your paragraph content here. Continuous study under qualified scholars builds tajweed precision.</p>`)
    },
    {
      id: "heading",
      title: "/heading",
      label: "Subheading (H1 - H6)",
      category: "text" as const,
      desc: "Section title for SEO structure",
      icon: <Heading2 size={16} className="text-purple-400" />,
      action: () => handleInsertBlockHtml(`<h2 class="font-serif text-xl md:text-2xl text-[#f3ecd8] font-bold mt-8 mb-4 border-b border-[#d9b45c]/20 pb-2">Key Principles of Tajweed Recitation</h2>`)
    },
    {
      id: "quote",
      title: "/quote",
      label: "Quote / Verse Box",
      category: "text" as const,
      desc: "Highlighted quote with golden accent line",
      icon: <Quote size={16} className="text-emerald-400" />,
      action: () => handleInsertBlockHtml(`
<blockquote class="border-l-4 border-[#d9b45c] bg-[#12141b] p-5 my-6 rounded-r-2xl shadow-lg">
  <p class="font-serif text-lg text-[#f2d98a] italic leading-relaxed">"And recite the Qur'an with measured recitation."</p>
  <cite class="text-xs text-[#c9c2ab] mt-2 block font-sans font-bold">— Surah Al-Muzzammil [73:4]</cite>
</blockquote>`)
    },
    {
      id: "pullquote",
      title: "/pullquote",
      label: "Pull Quote Callout",
      category: "text" as const,
      desc: "Large featured quote spanning article width",
      icon: <Quote size={16} className="text-amber-300" />,
      action: () => handleInsertBlockHtml(`
<div class="my-8 text-center p-6 border-y-2 border-[#d9b45c]/40 bg-[#07080b]">
  <p class="text-lg md:text-xl font-serif font-bold text-[#f2d98a]">"Knowledge is gained through patient, consistent study under certified scholars."</p>
  <span class="text-xs text-[#c9c2ab] mt-2 block">— Jamia Naeemia Lahore Faculty</span>
</div>`)
    },
    {
      id: "list",
      title: "/list",
      label: "Bulleted / Numbered List",
      category: "text" as const,
      desc: "Formatted bullet points or numbered lists",
      icon: <List size={16} className="text-yellow-400" />,
      action: () => handleInsertBlockHtml(`
<ul class="list-disc list-inside space-y-2 my-4 text-xs text-[#c9c2ab]">
  <li>Mastering Makharij (letter articulation points)</li>
  <li>Understanding Sifat (letter characteristics)</li>
  <li>Applying Ghunnah and Madd elongation rules</li>
</ul>`)
    },
    {
      id: "code",
      title: "/code",
      label: "Code / Shortcode Box",
      category: "text" as const,
      desc: "Monospaced code snippet container",
      icon: <FileCode size={16} className="text-emerald-400" />,
      action: () => handleInsertBlockHtml(`
<pre class="bg-[#07080b] border border-white/10 p-4 rounded-xl text-xs font-mono text-green-400 overflow-x-auto my-6"><code>[quran_audio surah="1" ayah="1-7" reciter="mishary"]</code></pre>`)
    },
    {
      id: "preformatted",
      title: "/preformatted",
      label: "Preformatted Text",
      category: "text" as const,
      desc: "Text box preserving exact spacing and formatting",
      icon: <FileText size={16} className="text-cyan-400" />,
      action: () => handleInsertBlockHtml(`
<pre class="bg-[#12141b] p-4 rounded-xl text-xs font-mono text-[#c9c2ab] my-4 border border-white/10 whitespace-pre-wrap">Preformatted text maintains exact spacing and line breaks.</pre>`)
    },
    {
      id: "classic",
      title: "/classic",
      label: "Classic Editor Block",
      category: "text" as const,
      desc: "Traditional WordPress classic content container",
      icon: <Edit3 size={16} className="text-orange-400" />,
      action: () => handleInsertBlockHtml(`
<div class="classic-editor-block p-4 my-6 bg-[#07080b] border border-[#d9b45c]/20 rounded-xl text-xs text-[#c9c2ab]">
  <p>Classic Editor Content Block</p>
</div>`)
    },

    // MEDIA BLOCKS
    {
      id: "image",
      title: "/image",
      label: "Image Block",
      category: "media" as const,
      desc: "Upload image with ALT text, caption & lazy loading",
      icon: <ImageIcon size={16} className="text-[#d9b45c]" />,
      action: () => setShowInternalImagesModal(true)
    },
    {
      id: "gallery",
      title: "/gallery",
      label: "Image Gallery Grid",
      category: "media" as const,
      desc: "3-column responsive photo grid gallery",
      icon: <Grid size={16} className="text-indigo-400" />,
      action: () => handleInsertBlockHtml(`
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
  <img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80" alt="Quran Study 1" class="rounded-xl h-40 w-full object-cover border border-white/10" />
  <img src="https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80" alt="Quran Study 2" class="rounded-xl h-40 w-full object-cover border border-white/10" />
  <img src="https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=600&q=80" alt="Quran Study 3" class="rounded-xl h-40 w-full object-cover border border-white/10" />
</div>`)
    },
    {
      id: "video",
      title: "/video",
      label: "Video Player",
      category: "media" as const,
      desc: "Embed video file player with controls",
      icon: <Video size={16} className="text-red-400" />,
      action: () => handleInsertBlockHtml(`
<div class="my-6 rounded-2xl overflow-hidden border border-[#d9b45c]/30 shadow-2xl">
  <video controls class="w-full aspect-video bg-black" poster="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80">
    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
  </video>
</div>`)
    },
    {
      id: "audio",
      title: "/audio",
      label: "Audio Player",
      category: "media" as const,
      desc: "Quran recitation audio player widget",
      icon: <Film size={16} className="text-pink-400" />,
      action: () => handleInsertBlockHtml(`
<div class="my-6 p-4 bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl flex items-center space-x-4">
  <div class="w-10 h-10 rounded-full bg-[#d9b45c] text-black flex items-center justify-center font-bold">♪</div>
  <div class="flex-1">
    <h4 class="text-xs font-bold text-white">Surah Al-Fatiha Recitation</h4>
    <audio controls class="w-full mt-2 h-8">
      <source src="https://server8.mp3quran.net/afs/001.mp3" type="audio/mpeg">
    </audio>
  </div>
</div>`)
    },
    {
      id: "file",
      title: "/file",
      label: "Download File Block",
      category: "media" as const,
      desc: "Attachment download box for PDF guides",
      icon: <Download size={16} className="text-emerald-400" />,
      action: () => handleInsertBlockHtml(`
<div class="bg-[#12141b] border border-emerald-500/30 p-4 rounded-2xl my-6 flex items-center justify-between">
  <div>
    <h4 class="font-bold text-white text-xs">Download Tajweed Rules Chart PDF</h4>
    <p class="text-[10px] text-[#c9c2ab]">Official Jamia Naeemia Lahore guide (2.8 MB)</p>
  </div>
  <a href="https://truthquranacademy.com/download" target="_blank" class="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all flex items-center space-x-1">
    <Download size={14} />
    <span>Download PDF</span>
  </a>
</div>`)
    },
    {
      id: "media",
      title: "/media",
      label: "Media Library",
      category: "media" as const,
      desc: "Choose asset from WordPress Media Library",
      icon: <ImageIcon size={16} className="text-[#d9b45c]" />,
      action: () => {
        setMediaTargetField("internal");
        setShowMediaLibraryModal(true);
      }
    },
    {
      id: "mediatext",
      title: "/media&text",
      label: "Media & Text Layout",
      category: "media" as const,
      desc: "Side-by-side media and explanatory text",
      icon: <Layout size={16} className="text-blue-400" />,
      action: () => handleInsertBlockHtml(`
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6 p-5 bg-[#12141b] rounded-2xl border border-white/10">
  <div>
    <img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80" alt="Media Text" class="rounded-xl w-full object-cover shadow-lg" />
  </div>
  <div class="space-y-2">
    <h4 class="font-serif font-bold text-white text-base">Interactive Tajweed Training</h4>
    <p class="text-xs text-[#c9c2ab] leading-relaxed">Our senior scholars provide live, 1-on-1 feedback in real time.</p>
  </div>
</div>`)
    },

    // LAYOUT BLOCKS
    {
      id: "columns",
      title: "/columns",
      label: "2-Column Layout",
      category: "layout" as const,
      desc: "Side-by-side content comparison columns",
      icon: <Layout size={16} className="text-cyan-400" />,
      action: () => handleInsertBlockHtml(`
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs leading-relaxed">
  <div class="bg-[#12141b] border border-white/10 p-5 rounded-2xl">
    <h4 class="font-bold text-white text-sm mb-2">Theoretical Tajweed</h4>
    <p class="text-[#c9c2ab]">Understanding rules, makharij points, and characteristics of Arabic letters.</p>
  </div>
  <div class="bg-[#12141b] border border-white/10 p-5 rounded-2xl">
    <h4 class="font-bold text-white text-sm mb-2">Practical Recitation</h4>
    <p class="text-[#c9c2ab]">Applying rules live with a qualified teacher who listens and corrects errors.</p>
  </div>
</div>`)
    },
    {
      id: "group",
      title: "/group",
      label: "Group Container Box",
      category: "layout" as const,
      desc: "Container card for grouping related elements",
      icon: <Layers size={16} className="text-purple-400" />,
      action: () => handleInsertBlockHtml(`
<div class="my-6 p-6 bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl shadow-xl space-y-3">
  <h4 class="text-sm font-bold text-[#f2d98a]">Grouped Content Container</h4>
  <p class="text-xs text-[#c9c2ab]">Organize related elements inside a single card container.</p>
</div>`)
    },
    {
      id: "row",
      title: "/row",
      label: "Flex Row",
      category: "layout" as const,
      desc: "Horizontal row flex layout container",
      icon: <Layout size={16} className="text-[#f2d98a]" />,
      action: () => handleInsertBlockHtml(`
<div class="flex flex-wrap items-center gap-4 my-6 p-4 bg-[#07080b] rounded-xl border border-white/10">
  <span class="px-3 py-1 bg-[#d9b45c]/20 text-[#f2d98a] rounded-lg text-xs font-bold">Tajweed Level 1</span>
  <span class="px-3 py-1 bg-[#d9b45c]/20 text-[#f2d98a] rounded-lg text-xs font-bold">Tajweed Level 2</span>
  <span class="px-3 py-1 bg-[#d9b45c]/20 text-[#f2d98a] rounded-lg text-xs font-bold">Ijazah Mastery</span>
</div>`)
    },
    {
      id: "stack",
      title: "/stack",
      label: "Vertical Stack",
      category: "layout" as const,
      desc: "Vertical stack container with tight spacing",
      icon: <Layers size={16} className="text-emerald-400" />,
      action: () => handleInsertBlockHtml(`
<div class="flex flex-col space-y-3 my-6 p-4 bg-[#12141b] rounded-xl border border-white/10">
  <div class="p-3 bg-[#07080b] rounded-lg text-xs text-white">Stack Element 1</div>
  <div class="p-3 bg-[#07080b] rounded-lg text-xs text-white">Stack Element 2</div>
</div>`)
    },
    {
      id: "spacer",
      title: "/spacer",
      label: "Spacer Block",
      category: "layout" as const,
      desc: "Adjustable vertical whitespace spacer",
      icon: <Minus size={16} className="text-gray-400" />,
      action: () => handleInsertBlockHtml(`<div class="my-8 h-8 w-full border-t border-b border-dashed border-white/10 flex items-center justify-center text-[10px] text-[#c9c2ab]/40 font-mono">Vertical Spacer (32px)</div>`)
    },
    {
      id: "separator",
      title: "/separator",
      label: "Divider / Separator",
      category: "layout" as const,
      desc: "Clean golden accent line separator",
      icon: <Minus size={16} className="text-[#d9b45c]" />,
      action: () => handleInsertBlockHtml(`<hr class="my-8 border-t border-[#d9b45c]/30" />`)
    },

    // DESIGN BLOCKS
    {
      id: "button",
      title: "/button",
      label: "Button Block (Interactive)",
      category: "design" as const,
      desc: "Customizable CTA button with color, size & link",
      icon: <Sparkles size={16} className="text-amber-400" />,
      action: () => setShowButtonModal(true)
    },
    {
      id: "buttons",
      title: "/buttons",
      label: "Buttons Group",
      category: "design" as const,
      desc: "Group of multiple action buttons side-by-side",
      icon: <Sparkles size={16} className="text-yellow-300" />,
      action: () => handleInsertBlockHtml(`
<div class="flex flex-wrap items-center justify-center gap-3 my-6">
  <a href="https://wa.me/+923219347471" target="_blank" class="px-6 py-3 bg-[#d9b45c] text-black font-extrabold text-xs rounded-full hover:bg-[#f2d98a] transition-all shadow-xl">Start Free Trial →</a>
  <a href="https://truthquranacademy.com/courses" class="px-6 py-3 bg-[#12141b] text-white border border-white/20 font-bold text-xs rounded-full hover:bg-white/10 transition-all">Explore Courses</a>
</div>`)
    },
    {
      id: "cover",
      title: "/cover",
      label: "Cover Image Banner",
      category: "design" as const,
      desc: "Full-width background image header with text overlay",
      icon: <ImageIcon size={16} className="text-rose-400" />,
      action: () => handleInsertBlockHtml(`
<div class="relative my-8 h-64 rounded-3xl overflow-hidden flex items-center justify-center text-center p-6 border border-[#d9b45c]/40 shadow-2xl" style="background: linear-gradient(180deg, rgba(7,8,11,0.7), rgba(7,8,11,0.9)), url('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80') center/cover;">
  <div class="max-w-xl space-y-3 z-10">
    <h3 class="font-serif text-2xl font-bold text-white">Unlock Quranic Knowledge</h3>
    <p class="text-xs text-[#c9c2ab]">Learn with certified scholars from Jamia Naeemia Lahore.</p>
    <a href="https://wa.me/+923219347471" target="_blank" class="inline-block px-6 py-2.5 bg-[#d9b45c] text-black font-extrabold text-xs rounded-full shadow-lg hover:bg-[#f2d98a]">Book Free Evaluation</a>
  </div>
</div>`)
    },
    {
      id: "table",
      title: "/table",
      label: "Data Table (Interactive Builder)",
      category: "design" as const,
      desc: "Interactive builder for responsive HTML data tables",
      icon: <TableIcon size={16} className="text-blue-400" />,
      action: () => setShowTableModal(true)
    },
    {
      id: "accordion",
      title: "/accordion",
      label: "Collapsible Accordion / Details",
      category: "design" as const,
      desc: "Expandable content drawer using HTML <details>",
      icon: <ChevronDown size={16} className="text-teal-400" />,
      action: () => handleInsertBlockHtml(`
<details class="my-4 p-4 bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl group cursor-pointer">
  <summary class="font-bold text-xs text-white list-none flex items-center justify-between">
    <span>Click to view detailed Tajweed rules breakdown</span>
    <span class="text-[#d9b45c] text-sm group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p class="mt-3 text-xs text-[#c9c2ab] leading-relaxed border-t border-white/5 pt-3">Tajweed consists of rules governing articulation points (Makharij), characteristics (Sifat), elongation (Madd), and nasalization (Ghunnah).</p>
</details>`)
    },
    {
      id: "callout",
      title: "/callout",
      label: "Callout Tip Box",
      category: "design" as const,
      desc: "Highlighted card for tips, warnings, and notes",
      icon: <MessageSquare size={16} className="text-emerald-400" />,
      action: () => handleInsertBlockHtml(`
<div class="bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl p-5 my-6 flex items-start space-x-4 shadow-xl">
  <div class="w-8 h-8 rounded-xl bg-[#d9b45c]/10 text-[#f2d98a] flex items-center justify-center flex-shrink-0 font-bold">💡</div>
  <div class="text-xs text-[#c9c2ab] leading-relaxed">
    <strong class="text-white block font-sans text-sm mb-1">Scholar's Recommendation:</strong>
    Always practice Quran recitation aloud under the direct supervision of a certified Quran instructor to fix silent pronunciation errors.
  </div>
</div>`)
    },

    // EMBED BLOCKS
    {
      id: "youtube",
      title: "/youtube",
      label: "YouTube Video Embed",
      category: "embed" as const,
      desc: "Responsive YouTube player container",
      icon: <Film size={16} className="text-red-500" />,
      action: () => {
        setEmbedType("youtube");
        setShowEmbedModal(true);
      }
    },
    {
      id: "vimeo",
      title: "/vimeo",
      label: "Vimeo Video Embed",
      category: "embed" as const,
      desc: "Embed Vimeo video player container",
      icon: <Film size={16} className="text-blue-400" />,
      action: () => {
        setEmbedType("vimeo");
        setShowEmbedModal(true);
      }
    },
    {
      id: "googlemaps",
      title: "/googlemaps",
      label: "Google Maps Embed",
      category: "embed" as const,
      desc: "Interactive map embed container",
      icon: <Globe size={16} className="text-green-400" />,
      action: () => {
        setEmbedType("googlemaps");
        setShowEmbedModal(true);
      }
    },
    {
      id: "html",
      title: "/html",
      label: "Custom HTML Container",
      category: "embed" as const,
      desc: "Raw HTML or iframe script container",
      icon: <Code size={16} className="text-orange-400" />,
      action: () => handleInsertBlockHtml(`<div class="raw-html-block my-4 p-4 border border-white/10 rounded-xl bg-[#07080b] text-xs font-mono text-green-400"><!-- Custom HTML Code Here --></div>`)
    },
    {
      id: "embed",
      title: "/embed",
      label: "Custom Embed Block",
      category: "embed" as const,
      desc: "Generic embed block for third-party widgets",
      icon: <ExternalLink size={16} className="text-purple-400" />,
      action: () => {
        setEmbedType("custom");
        setShowEmbedModal(true);
      }
    },

    // SEO & CONVERSION BLOCKS
    {
      id: "faq",
      title: "/faq",
      label: "FAQ Accordion (Schema Ready)",
      category: "seo" as const,
      desc: "Interactive FAQ accordion with schema JSON-LD",
      icon: <FaqIcon size={16} className="text-pink-400" />,
      action: () => setShowFaqModal(true)
    },
    {
      id: "toc",
      title: "/tableofcontents",
      label: "Table of Contents Box",
      category: "seo" as const,
      desc: "Article jump links list for longform posts",
      icon: <ListOrdered size={16} className="text-[#d9b45c]" />,
      action: () => handleInsertBlockHtml(`
<div class="my-6 p-5 bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl shadow-xl space-y-3">
  <h4 class="font-serif font-bold text-[#f2d98a] text-sm flex items-center space-x-2"><span>📑 Table of Contents</span></h4>
  <ol class="list-decimal list-inside space-y-1.5 text-xs text-[#d9b45c]">
    <li><a href="#section-1" class="hover:underline">1. Introduction to Tajweed Rules</a></li>
    <li><a href="#section-2" class="hover:underline">2. Articulation Points (Makharij)</a></li>
    <li><a href="#section-3" class="hover:underline">3. Common Recitation Mistakes</a></li>
    <li><a href="#section-4" class="hover:underline">4. FAQ & Online Classes</a></li>
  </ol>
</div>`)
    },
    {
      id: "cta",
      title: "/calltoaction",
      label: "Call to Action Banner (Interactive)",
      category: "seo" as const,
      desc: "High-converting lead acquisition banner",
      icon: <Sparkles size={16} className="text-amber-400" />,
      action: () => setShowCtaModal(true)
    },
    {
      id: "internal_link",
      title: "/internal link",
      label: "Internal Link Search",
      category: "seo" as const,
      desc: "Search & link to existing pages/courses/posts",
      icon: <Link2 size={16} className="text-[#d9b45c]" />,
      action: () => setShowInternalLinkModal(true)
    },
    {
      id: "external_link",
      title: "/external link",
      label: "External Reference Link",
      category: "seo" as const,
      desc: "Link to authoritative external source",
      icon: <ExternalLink size={16} className="text-blue-400" />,
      action: () => setShowExternalLinkModal(true)
    },
    {
      id: "shortcode",
      title: "/shortcode",
      label: "WordPress Shortcode",
      category: "seo" as const,
      desc: "Insert shortcodes like [quran_audio_player]",
      icon: <Code2 size={16} className="text-[#d9b45c]" />,
      action: () => handleInsertBlockHtml(`<div class="my-4 text-xs font-mono text-[#f2d98a] bg-[#07080b] p-3 rounded-xl border border-[#d9b45c]/30">[quran_audio_player]</div>`)
    }
  ];

  const filteredSlashCommands = slashCommands.filter(
    (c) =>
      (activeBlockCategory === "all" || c.category === activeBlockCategory) &&
      (c.title.toLowerCase().includes(slashSearch.toLowerCase()) ||
        c.label.toLowerCase().includes(slashSearch.toLowerCase()) ||
        c.desc.toLowerCase().includes(slashSearch.toLowerCase()))
  );

  // File Upload Helpers for Featured & Internal Images
  const handleFileUpload = (file: File, target: "featured" | "internal") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (target === "featured") {
        setPendingCropImage(dataUrl);
        handleUpdateField("originalCoverImage", dataUrl);
        handleUpdateField("imageFileName", file.name);
        
        // Reset crop studio options to default 3:2
        setCropScale(1.0);
        setCropPanX(0);
        setCropPanY(0);
        setCropBrightness(100);
        setCropContrast(100);
        setCropSaturation(100);
        setCropAspectRatio("3:2");

        // Open live 3:2 Cropper & Optimization Studio
        setShowCropModal(true);
        showToast("File uploaded! Verify dimensions & crop to 1200 × 800 px (3:2 Aspect Ratio).");
      } else {
        // Insert internal image block
        const imgHtml = `
<figure className="my-6 text-center">
  <img 
    src="${dataUrl}" 
    alt="${currentPost?.focusKeyword || 'Quranic Tajweed Illustration'}" 
    loading="lazy" 
    class="rounded-2xl max-w-full mx-auto shadow-xl border border-white/10" 
  />
  <figcaption className="text-xs text-[#c9c2ab] italic mt-2">${file.name.replace(/\.[^/.]+$/, "")}</figcaption>
</figure>`;
        handleInsertBlockHtml(imgHtml);
        showToast("Internal image uploaded & inserted!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropFeatured = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], "featured");
    }
  };

  const handleDropInternal = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], "internal");
    }
  };

  // Internal Link Select Handler
  const handleInsertInternalLink = (url: string, linkText: string) => {
    if (!currentPost) return;
    const anchorHtml = `<a href="${url}" title="${linkText}" class="text-[#d9b45c] font-bold underline hover:text-[#f2d98a]">${linkText}</a>`;
    const updatedContent = `${currentPost.content || ""}\n<p>Related Reading: ${anchorHtml}</p>`;
    handleUpdateField("content", updatedContent);
    handleUpdateField("internalLinksCount", (currentPost.internalLinksCount || 0) + 1);
    setShowInternalLinkModal(false);
    showToast(`Internal link to "${linkText}" inserted!`);
  };

  // External Link Select Handler
  const handleInsertExternalLink = () => {
    if (!currentPost || !extLinkUrl) return;
    const anchorHtml = `<a href="${extLinkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-400 font-bold underline hover:text-blue-300">${extLinkText}</a>`;
    const updatedContent = `${currentPost.content || ""}\n<p>Reference: ${anchorHtml}</p>`;
    handleUpdateField("content", updatedContent);
    handleUpdateField("externalLinksCount", (currentPost.externalLinksCount || 0) + 1);
    setShowExternalLinkModal(false);
    showToast(`External link to "${extLinkUrl}" inserted!`);
  };

  // Batch insert images from Internal Images Modal
  const handleInsertSelectedInternalImages = () => {
    if (selectedInternalImages.length === 0) return;

    let combinedHtml = "";
    selectedInternalImages.forEach((imgUrl, idx) => {
      combinedHtml += `
<figure className="my-6 text-${imgAlign}">
  <img 
    src="${imgUrl}" 
    alt="${imgAltText || currentPost?.focusKeyword || 'Quranic Tajweed Guide Photo'}" 
    title="${imgTitleText || 'Academy Media'}"
    loading="lazy" 
    style="width: ${imgWidth};" 
    class="rounded-2xl max-w-full mx-auto shadow-2xl border border-white/10" 
  />
  ${imgCaptionText ? `<figcaption className="text-xs text-[#c9c2ab] italic mt-2">${imgCaptionText}</figcaption>` : ""}
</figure>\n`;
    });

    handleInsertBlockHtml(combinedHtml);
    setSelectedInternalImages([]);
    setShowInternalImagesModal(false);
    showToast(`${selectedInternalImages.length} image(s) inserted into post!`);
  };

  if (!currentPost) {
    return (
      <div className="p-8 bg-[#12141b] rounded-2xl border border-[#d9b45c]/20 text-center space-y-4">
        <FileText size={48} className="mx-auto text-[#d9b45c]/40" />
        <h3 className="text-lg font-serif font-bold text-white">No Articles Found</h3>
        <p className="text-xs text-[#c9c2ab]">Create your first blog post to unlock Rank Math Pro SEO optimization tools.</p>
        <button
          onClick={handleCreateNewPost}
          className="px-5 py-2.5 bg-[#d9b45c] text-black rounded-xl font-bold text-xs hover:bg-[#f2d98a] transition-all"
        >
          + Create First Article
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left relative font-sans">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#d9b45c] text-black px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center space-x-2 border border-black/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: RANK MATH PRO TOOLBAR & CONTROL BAR */}
      <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d9b45c]/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d9b45c] to-[#997a2e] text-black flex items-center justify-center font-bold font-serif text-lg shadow-md">
              RM
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-lg md:text-xl text-white font-bold">Rank Math Pro Article Studio</h2>
                <span className="bg-[#d9b45c]/10 border border-[#d9b45c]/30 text-[#f2d98a] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  Gutenberg v3.4
                </span>
              </div>
              <p className="text-[11px] text-[#c9c2ab] mt-0.5">Real-time SEO Audit Engine, Visual Gutenberg Blocks & Website Router</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCreateNewPost}
              className="px-3 py-2 bg-[#1e2230] hover:bg-[#282d3f] text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Plus size={14} className="text-[#d9b45c]" />
              <span>New Article</span>
            </button>

            <button
              onClick={() => handleSaveArticle("draft")}
              className="px-3 py-2 bg-[#12141b] hover:bg-white/5 text-[#c9c2ab] border border-white/15 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Save size={14} />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleSaveArticle("published")}
              className="px-4 py-2 bg-gradient-to-r from-[#f2d98a] via-[#d9b45c] to-[#b38f3b] text-black rounded-xl text-xs font-bold shadow-lg hover:brightness-110 transition-all flex items-center space-x-1.5"
            >
              <Check size={14} />
              <span>Publish / Sync Website</span>
            </button>

            <a
              href={`/blog/${currentPost.slug || currentPost.id}`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  navigateToRoute("blog-post", currentPost.slug || currentPost.id);
                }
              }}
              className="px-3 py-2 bg-[#07080b] hover:bg-[#12141b] text-[#d9b45c] border border-[#d9b45c]/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>View Live Page</span>
            </a>

            <button
              onClick={handleDeletePost}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all"
              title="Delete Article"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Post Selector, Dual Mode Switcher & Device Frame */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          {/* Post Selection Dropdown */}
          <div className="flex items-center space-x-2 flex-1 max-w-lg">
            <span className="text-[10px] uppercase font-bold text-[#c9c2ab] whitespace-nowrap">Editing Article:</span>
            <select
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
              className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#d9b45c]"
            >
              <option value="new">✨ + Write New Article...</option>
              {posts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.status === "published" ? "🟢" : "🟡"} {p.title || "Untitled Article"}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSelectedPostId("new")}
              className="px-3 py-2 bg-[#d9b45c] hover:bg-[#f2d98a] text-black font-extrabold text-xs rounded-xl flex items-center space-x-1 whitespace-nowrap transition-all shadow-md"
              title="Create new article"
            >
              <Plus size={14} />
              <span>New</span>
            </button>
          </div>

          {/* DUAL EDITING MODE SWITCHER (Visual vs Code) */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-[#c9c2ab] whitespace-nowrap">Editor Mode:</span>
            <div className="flex items-center p-1 bg-[#07080b] border border-[#d9b45c]/30 rounded-xl">
              <button
                onClick={() => setEditorMode("visual")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  editorMode === "visual" ? "bg-[#d9b45c] text-black shadow-md" : "text-[#c9c2ab] hover:text-white"
                }`}
              >
                <Eye size={13} />
                <span>Visual Editor</span>
              </button>
              <button
                onClick={() => setEditorMode("code")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  editorMode === "code" ? "bg-[#d9b45c] text-black shadow-md" : "text-[#c9c2ab] hover:text-white"
                }`}
              >
                <Code size={13} />
                <span>HTML Code Editor</span>
              </button>
            </div>
          </div>

          {/* Device Frame Switcher */}
          <div className="flex items-center space-x-1 bg-[#07080b] border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setDeviceFrame("desktop")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                deviceFrame === "desktop" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-white"
              }`}
            >
              <Monitor size={12} />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceFrame("tablet")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                deviceFrame === "tablet" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-white"
              }`}
            >
              <Tablet size={12} />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceFrame("mobile")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                deviceFrame === "mobile" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-white"
              }`}
            >
              <Smartphone size={12} />
              <span>Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: WORKSPACE & RANK MATH SIDEBAR */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: GUTENBERG WORKSPACE (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* ARTICLE METRICS BAR */}
          <div className="bg-[#12141b]/90 border border-[#d9b45c]/15 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase ${
                  currentPost.status === "published" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}>
                  {currentPost.status || "published"}
                </span>
                <span className="text-[#c9c2ab] font-mono text-[10px]">URL Slug: /blog/{currentPost.slug}</span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://truthquranacademy.com/blog/${currentPost.slug}`);
                  showToast("Live article URL copied!");
                }}
                className="px-2 py-1 bg-[#07080b] hover:bg-white/5 text-[#d9b45c] rounded text-[10px] font-bold flex items-center space-x-1 border border-[#d9b45c]/20"
              >
                <Copy size={10} />
                <span>Copy URL</span>
              </button>
            </div>

            {/* Post Meta Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-[#c9c2ab]/50 block">Word Count</span>
                <span className="font-bold text-white font-mono">{contentStats.words} words</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-[#c9c2ab]/50 block">Reading Time</span>
                <span className="font-bold text-white font-mono">{contentStats.readingTime}</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-[#c9c2ab]/50 block">Paragraphs</span>
                <span className="font-bold text-white font-mono">{contentStats.paragraphs}</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-[#c9c2ab]/50 block">Author</span>
                <span className="font-bold text-[#d9b45c] truncate block">{currentPost.author?.name || "Muhammad Zain"}</span>
              </div>
            </div>
          </div>

          {/* ARTICLE CONTENT CANVAS */}
          <div className={`mx-auto transition-all duration-300 ${
            deviceFrame === "tablet" ? "max-w-[768px] border-8 border-[#12141b] rounded-3xl p-4 shadow-2xl bg-[#07080b]" :
            deviceFrame === "mobile" ? "max-w-[375px] border-8 border-[#12141b] rounded-3xl p-3 shadow-2xl bg-[#07080b]" :
            "w-full"
          }`}>
            <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 md:p-6 space-y-5">
              
              {/* Post Title (H1 Tag) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-wider flex items-center space-x-1">
                    <Heading1 size={12} />
                    <span>Post Title (H1 Tag)</span>
                  </label>
                  <span className={`text-[9px] font-mono ${currentPost.title.length >= 30 && currentPost.title.length <= 65 ? "text-green-400" : "text-yellow-400"}`}>
                    {currentPost.title.length} chars
                  </span>
                </div>
                <input
                  type="text"
                  value={currentPost.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleUpdateField("title", val);
                    if (!currentPost.slug || currentPost.slug.startsWith("new-article")) {
                      handleUpdateField("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                    }
                  }}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-4 py-3 text-lg md:text-xl font-serif font-bold text-white focus:outline-none focus:border-[#d9b45c] transition-colors"
                  placeholder="Enter a compelling article title..."
                />
              </div>

              {/* Permalink / Slug Bar */}
              <div className="bg-[#07080b] border border-white/10 rounded-xl p-3 flex items-center space-x-2 text-xs font-mono">
                <span className="text-[#c9c2ab]/50">https://truthquranacademy.com/blog/</span>
                <input
                  type="text"
                  value={currentPost.slug || ""}
                  onChange={(e) => handleUpdateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="flex-1 bg-transparent border-b border-[#d9b45c]/30 text-[#f2d98a] font-bold outline-none px-1"
                  placeholder="article-url-slug"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider">Article Lead Excerpt (Short Summary)</label>
                <textarea
                  rows={2}
                  value={currentPost.excerpt}
                  onChange={(e) => handleUpdateField("excerpt", e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c] resize-none"
                  placeholder="Write a short summary introducing this article..."
                />
              </div>

              {/* GUTENBERG & RANK MATH RICH FORMATTING & BLOCK INSERTER TOOLBAR */}
              <div className="bg-[#07080b] border border-[#d9b45c]/30 p-3 rounded-2xl space-y-2 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex flex-wrap items-center gap-1 text-xs">
                    {/* Gutenberg Inserter (+) Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSlashMenu(true);
                        setSlashSearch("");
                      }}
                      className="px-3 py-1.5 bg-[#d9b45c] text-black rounded-lg font-extrabold flex items-center space-x-1.5 hover:bg-[#f2d98a] transition-all shadow-md active:scale-95"
                    >
                      <Plus size={16} />
                      <span>Add Block</span>
                    </button>

                    {/* Undo / Redo Buttons */}
                    <div className="flex items-center space-x-1 border-r border-white/10 pr-2 mr-1">
                      <button
                        type="button"
                        onClick={handleUndo}
                        disabled={historyIndex <= 0}
                        className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white disabled:opacity-30 rounded border border-white/10"
                        title="Undo (Ctrl+Z)"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={handleRedo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white disabled:opacity-30 rounded border border-white/10"
                        title="Redo (Ctrl+Y)"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>

                    {/* Headings */}
                    <button
                      type="button"
                      onClick={() => applyHeadingToSelection("h2")}
                      className="px-2 py-1 bg-[#12141b] text-[#f2d98a] font-serif font-bold hover:bg-[#d9b45c]/20 rounded border border-white/10 text-xs"
                      title="Insert H2 Subheading"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => applyHeadingToSelection("h3")}
                      className="px-2 py-1 bg-[#12141b] text-[#f2d98a] font-serif font-bold hover:bg-[#d9b45c]/20 rounded border border-white/10 text-xs"
                      title="Insert H3 Subheading"
                    >
                      H3
                    </button>

                    {/* Inline Styles */}
                    <button
                      type="button"
                      onClick={() => applyFormattingToSelection("<b>", "</b>", "bold text")}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/10 font-bold"
                      title="Bold text"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormattingToSelection("<i>", "</i>", "italic text")}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/10 italic"
                      title="Italic text"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormattingToSelection("<u>", "</u>", "underlined text")}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/10 underline"
                      title="Underline text"
                    >
                      <Underline size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormattingToSelection("<s>", "</s>", "strikethrough text")}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/10 line-through"
                      title="Strikethrough text"
                    >
                      <Strikethrough size={14} />
                    </button>

                    {/* Alignment */}
                    <button
                      type="button"
                      onClick={() => applyFormattingToSelection('<p class="text-left">', '</p>', 'left-aligned text')}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/10"
                      title="Align Left"
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormattingToSelection('<p class="text-center">', '</p>', 'centered text')}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/10"
                      title="Align Center"
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormattingToSelection('<p class="text-right">', '</p>', 'right-aligned text')}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/10"
                      title="Align Right"
                    >
                      <AlignRight size={14} />
                    </button>

                    {/* Text Color Swatches */}
                    <div className="flex items-center space-x-1 pl-1 border-l border-white/10">
                      <button
                        type="button"
                        onClick={() => applyColorToSelection("#d9b45c", "Gold")}
                        className="w-4 h-4 rounded-full bg-[#d9b45c] border border-white/20 hover:scale-110 transition-transform"
                        title="Gold Text Color"
                      />
                      <button
                        type="button"
                        onClick={() => applyColorToSelection("#ffffff", "White")}
                        className="w-4 h-4 rounded-full bg-white border border-white/20 hover:scale-110 transition-transform"
                        title="White Text Color"
                      />
                      <button
                        type="button"
                        onClick={() => applyColorToSelection("#10b981", "Emerald")}
                        className="w-4 h-4 rounded-full bg-emerald-500 border border-white/20 hover:scale-110 transition-transform"
                        title="Emerald Text Color"
                      />
                      <button
                        type="button"
                        onClick={() => applyColorToSelection("#38bdf8", "Sky Blue")}
                        className="w-4 h-4 rounded-full bg-sky-400 border border-white/20 hover:scale-110 transition-transform"
                        title="Sky Blue Text Color"
                      />
                    </div>

                    {/* Quick Modals */}
                    <button
                      type="button"
                      onClick={() => setShowInternalImagesModal(true)}
                      className="px-2.5 py-1 bg-[#12141b] hover:bg-white/5 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg font-bold flex items-center space-x-1"
                    >
                      <ImageIcon size={13} />
                      <span>+ Images</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowInternalLinkModal(true)}
                      className="px-2.5 py-1 bg-[#12141b] hover:bg-white/5 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg font-bold flex items-center space-x-1"
                    >
                      <Link2 size={13} />
                      <span>Internal Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowTableModal(true)}
                      className="p-1.5 bg-[#12141b] text-blue-400 hover:text-white rounded border border-white/10"
                      title="Insert Table"
                    >
                      <TableIcon size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowButtonModal(true)}
                      className="p-1.5 bg-[#12141b] text-amber-400 hover:text-white rounded border border-white/10"
                      title="Insert Button"
                    >
                      <Sparkles size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowFaqModal(true)}
                      className="p-1.5 bg-[#12141b] text-pink-400 hover:text-white rounded border border-white/10"
                      title="Insert FAQ Accordion"
                    >
                      <FaqIcon size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={clearFormattingSelection}
                      className="px-2 py-1 bg-[#12141b] text-rose-400 hover:text-white rounded border border-white/10 text-[10px] font-bold"
                      title="Clear Formatting"
                    >
                      Clear HTML
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-[#d9b45c] flex items-center space-x-1">
                    <Sparkles size={12} />
                    <span>Type <code className="bg-[#12141b] px-1 py-0.5 rounded text-white font-bold">/</code> inside editor for Gutenberg commands</span>
                  </span>
                </div>
              </div>

              {/* GUTENBERG BLOCK INSERTER POPUP MODAL */}
              {showSlashMenu && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#12141b] border-2 border-[#d9b45c]/50 rounded-3xl p-6 max-w-3xl w-full space-y-4 shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-[#d9b45c] text-black flex items-center justify-center font-bold">
                          +
                        </div>
                        <h3 className="font-serif text-lg font-bold text-white">Gutenberg Block Library</h3>
                      </div>
                      <button onClick={() => setShowSlashMenu(false)} className="text-[#c9c2ab] hover:text-white p-1 rounded-lg hover:bg-white/5">
                        <X size={20} />
                      </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-3 text-[#d9b45c]" />
                      <input
                        type="text"
                        value={slashSearch}
                        onChange={(e) => setSlashSearch(e.target.value)}
                        placeholder="Search Gutenberg blocks (e.g., /heading, /table, /image, /faq, /youtube, /cta)..."
                        className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#d9b45c]"
                        autoFocus
                      />
                      {slashSearch && (
                        <button onClick={() => setSlashSearch("")} className="absolute right-3 top-3 text-[#c9c2ab] hover:text-white">
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-1 border-b border-white/10 pb-2 text-xs font-bold">
                      {(["all", "text", "media", "layout", "design", "embed", "seo"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveBlockCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                            activeBlockCategory === cat
                              ? "bg-[#d9b45c] text-black font-extrabold"
                              : "bg-[#07080b] text-[#c9c2ab] hover:text-white border border-white/5"
                          }`}
                        >
                          {cat === "all" ? "All Blocks" : cat}
                        </button>
                      ))}
                    </div>

                    {/* Filtered Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 overflow-y-auto pr-1 flex-1 py-1">
                      {filteredSlashCommands.map((cmd) => (
                        <div
                          key={cmd.id}
                          onClick={() => {
                            cmd.action();
                            setShowSlashMenu(false);
                          }}
                          className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 hover:border-[#d9b45c]/40 rounded-2xl cursor-pointer transition-all flex items-start space-x-3 group relative hover:scale-[1.02]"
                        >
                          <div className="p-2 rounded-xl bg-[#12141b] group-hover:bg-[#d9b45c] group-hover:text-black transition-colors flex-shrink-0">
                            {cmd.icon}
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-mono text-xs font-extrabold text-[#f2d98a]">{cmd.title}</span>
                              <span className="text-[9px] uppercase font-bold text-[#d9b45c]/70 px-1.5 py-0.5 bg-[#d9b45c]/10 rounded">
                                {cmd.category}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white group-hover:text-[#f2d98a]">{cmd.label}</h4>
                            <p className="text-[10px] text-[#c9c2ab]/70 line-clamp-2">{cmd.desc}</p>
                          </div>
                        </div>
                      ))}

                      {filteredSlashCommands.length === 0 && (
                        <div className="col-span-3 py-8 text-center text-xs text-[#c9c2ab]">
                          No blocks found matching "{slashSearch}". Try searching for "/table", "/heading", or "/image".
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* DUAL MODE EDITOR CANVAS */}
              {editorMode === "code" ? (
                /* HTML CODE EDITOR MODE */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-[#d9b45c] flex items-center space-x-1">
                      <Code size={12} />
                      <span>Full HTML Code Editor</span>
                    </label>
                    <span className="text-[9px] font-mono text-[#c9c2ab]">
                      Raw HTML Mode | {contentStats.words} words
                    </span>
                  </div>
                  <textarea
                    id="gutenberg-content-textarea"
                    rows={18}
                    value={currentPost.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdateField("content", val);
                      // Slash trigger
                      const selStart = e.target.selectionStart;
                      if (selStart > 0 && val.charAt(selStart - 1) === "/") {
                        setShowSlashMenu(true);
                        setSlashSearch("");
                      }
                    }}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-2xl p-4 text-xs font-mono text-green-400 focus:outline-none focus:border-[#d9b45c] leading-relaxed resize-y shadow-inner"
                    placeholder="Write raw HTML content here..."
                  />
                </div>
              ) : (
                /* VISUAL RICH EDITOR CANVAS WITH GUTENBERG KEYBOARD DISPATCH */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider flex items-center space-x-1">
                      <Eye size={12} />
                      <span>Visual Editor Canvas</span>
                    </label>
                    <span className="text-[9px] font-mono text-[#d9b45c]">
                      {contentStats.words} words | {contentStats.paragraphs} paragraphs | {contentStats.readingTime}
                    </span>
                  </div>

                  {/* VISUAL DRAG & DROP DROPZONE */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDropInternal}
                    className="border-2 border-dashed border-[#d9b45c]/30 hover:border-[#d9b45c] bg-[#07080b]/50 rounded-xl p-3 text-center transition-colors cursor-pointer"
                    onClick={() => internalFileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={internalFileInputRef}
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "internal")}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center justify-center space-x-2 text-xs text-[#c9c2ab]">
                      <Upload size={14} className="text-[#d9b45c]" />
                      <span>Drag & Drop image file anywhere on editor or click to upload internal photo</span>
                    </div>
                  </div>

                  <textarea
                    id="gutenberg-content-textarea"
                    rows={18}
                    value={currentPost.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdateField("content", val);
                      const selStart = e.target.selectionStart;
                      if (selStart > 0 && val.charAt(selStart - 1) === "/") {
                        setShowSlashMenu(true);
                        setSlashSearch("");
                      }
                    }}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors leading-relaxed resize-y shadow-inner"
                    placeholder="Write article content... Type '/' anywhere to open Gutenberg block inserter menu."
                  />
                </div>
              )}

              {/* RENDERED ARTICLE VISUAL OUTPUT PREVIEW */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-widest flex items-center space-x-1">
                  <Eye size={12} />
                  <span>Rendered Article Visual Output</span>
                </span>
                <div className="bg-[#07080b] border border-white/5 rounded-xl p-5 text-left text-xs space-y-3 prose prose-invert max-w-none text-white leading-relaxed overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: currentPost.content || "<p className='text-gray-500 italic'>No content written yet.</p>" }} />
                </div>
              </div>

            </div>
          </div>

          {/* FEATURED IMAGE PANEL WITH 3:2 CROPPER & RANK MATH RECOMMENDATIONS */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-3 gap-2">
              <div>
                <h3 className="text-xs font-serif font-bold text-[#d9b45c] uppercase tracking-wider flex items-center space-x-2">
                  <ImageIcon size={14} />
                  <span>Featured Image (Rank Math SEO Standard)</span>
                </h3>
                <p className="text-[10px] text-[#c9c2ab] mt-0.5">
                  Recommended upload size: <strong className="text-white">1200 × 800 pixels</strong> (3:2 Aspect Ratio)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono uppercase bg-[#d9b45c]/10 text-[#f2d98a] border border-[#d9b45c]/30 px-2 py-0.5 rounded-full font-bold">
                  3:2 Ratio (1200×800 px)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPendingCropImage(currentPost.originalCoverImage || currentPost.coverImage || null);
                    setShowCropModal(true);
                  }}
                  className="px-2.5 py-1 bg-[#07080b] hover:bg-white/5 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                >
                  <Crop size={12} />
                  <span>3:2 Crop Tool</span>
                </button>
              </div>
            </div>

            {/* DRAG & DROP FEATURED IMAGE DROPZONE */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropFeatured}
              className="border-2 border-dashed border-[#d9b45c]/40 hover:border-[#d9b45c] bg-[#07080b] p-6 rounded-2xl text-center space-y-2 cursor-pointer transition-all relative group"
              onClick={() => featuredFileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={featuredFileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "featured")}
                accept="image/*"
                className="hidden"
              />
              <Upload size={28} className="mx-auto text-[#d9b45c] group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Upload Featured Image from Computer</div>
              <p className="text-[10px] text-[#c9c2ab]">
                Drag & drop image file or click to browse. Recommended size: <span className="text-[#f2d98a] font-bold font-mono">1200 × 800 pixels</span>
              </p>

              <div className="flex flex-wrap justify-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTargetField("featured");
                    setShowMediaLibraryModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#12141b] hover:bg-white/10 text-[#d9b45c] border border-[#d9b45c]/30 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                >
                  <ImageIcon size={12} />
                  <span>Select from Media Library</span>
                </button>

                {currentPost.coverImage && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setPendingCropImage(currentPost.originalCoverImage || currentPost.coverImage);
                        setShowCropModal(true);
                      }}
                      className="px-3 py-1.5 bg-[#d9b45c]/10 hover:bg-[#d9b45c]/20 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                    >
                      <Crop size={12} />
                      <span>Crop & Adjust (3:2)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateField("coverImage", "");
                        handleUpdateField("featuredImage", "");
                        handleUpdateField("originalCoverImage", "");
                        setImageNaturalDims(null);
                      }}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[11px] font-bold"
                    >
                      Remove Image
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* DIMENSION VALIDATION & STATUS BADGE */}
            {imageNaturalDims && (
              <div className={`p-3 rounded-xl border text-xs flex items-start space-x-3 ${
                imageNaturalDims.width >= 1200 && imageNaturalDims.height >= 800 && Math.abs((imageNaturalDims.width / imageNaturalDims.height) - 1.5) < 0.05
                  ? "bg-green-500/10 border-green-500/30 text-green-300"
                  : imageNaturalDims.width < 1200 || imageNaturalDims.height < 800
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-300"
              }`}>
                {imageNaturalDims.width >= 1200 && imageNaturalDims.height >= 800 && Math.abs((imageNaturalDims.width / imageNaturalDims.height) - 1.5) < 0.05 ? (
                  <CheckCircle2 size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center space-x-2">
                    <span>Active Image Dimensions: {imageNaturalDims.width} × {imageNaturalDims.height} px</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 bg-black/40 rounded border border-white/10">
                      Ratio: {(imageNaturalDims.width / imageNaturalDims.height).toFixed(2)}:1
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-90">
                    {imageNaturalDims.width >= 1200 && imageNaturalDims.height >= 800 && Math.abs((imageNaturalDims.width / imageNaturalDims.height) - 1.5) < 0.05
                      ? "✓ Verified Rank Math SEO Standard (1200 × 800 px, 3:2 Ratio). Image is perfectly formatted for search snippets & HD social sharing."
                      : imageNaturalDims.width < 1200 || imageNaturalDims.height < 800
                        ? `⚠️ Image is smaller than recommended 1200 × 800 pixels. Use the 3:2 Crop Studio to optimize resolution.`
                        : `⚠️ Current aspect ratio is ${(imageNaturalDims.width / imageNaturalDims.height).toFixed(2)}:1. Use the 3:2 Crop Tool to align with the 1200 × 800 px standard.`}
                  </p>
                </div>
              </div>
            )}

            {/* EDITABLE IMAGE PROPERTIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Featured Image ALT Text (SEO)</label>
                  <span className={`text-[8px] font-mono ${currentPost.imageAltText ? "text-green-400" : "text-red-400"}`}>
                    {currentPost.imageAltText ? "Added" : "Missing"}
                  </span>
                </div>
                <input
                  type="text"
                  value={currentPost.imageAltText || ""}
                  onChange={(e) => handleUpdateField("imageAltText", e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Describe image for search engine indexing..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Image Title Attribute</label>
                <input
                  type="text"
                  value={currentPost.imageTitle || ""}
                  onChange={(e) => handleUpdateField("imageTitle", e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Image title attribute..."
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Image Caption (Visible below photo)</label>
                <input
                  type="text"
                  value={currentPost.imageCaption || ""}
                  onChange={(e) => handleUpdateField("imageCaption", e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  placeholder="e.g. Online Quran Recitation Session at Truth Quran Academy"
                />
              </div>
            </div>

            {/* PREVIEW FEATURED IMAGE BANNER (RESPONSIVE 3:2 ASPECT RATIO) */}
            {currentPost.coverImage && (
              <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden border border-[#d9b45c]/30 mt-2 shadow-xl bg-black">
                <img
                  src={currentPost.coverImage}
                  alt={currentPost.imageAltText || "Cover Image"}
                  className="w-full h-full object-cover"
                  style={{
                    filter: `brightness(${cropBrightness}%) contrast(${cropContrast}%) saturate(${cropSaturation}%)`
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] uppercase font-bold bg-[#d9b45c] text-black px-2 py-0.5 rounded">
                        {currentPost.category}
                      </span>
                      <span className="text-[9px] font-mono text-[#f2d98a] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                        3:2 Preview (1200 × 800)
                      </span>
                    </div>
                    <h4 className="text-white text-sm font-serif font-bold mt-1.5">{currentPost.title}</h4>
                    {currentPost.imageCaption && (
                      <p className="text-[10px] text-[#c9c2ab] italic mt-0.5">{currentPost.imageCaption}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: RANK MATH PRO REAL-TIME SEO SIDEBAR (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* 1. RANK MATH PRO DYNAMIC CIRCULAR SCORE GAUGE */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 text-center space-y-4 relative overflow-hidden shadow-xl">
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              seoAnalysis.score >= 80 ? "bg-green-500" : seoAnalysis.score >= 50 ? "bg-yellow-500" : "bg-red-500"
            }`} />

            <div className="flex items-center justify-between pb-1 border-b border-white/5">
              <span className="text-[10px] uppercase font-sans font-extrabold tracking-widest text-[#d9b45c]">
                Rank Math Pro Score
              </span>
              <span className="text-[8px] font-mono text-[#c9c2ab]/50 uppercase">Live Real-time Audit</span>
            </div>

            {/* Circular Score Gauge */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1e2230" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={seoAnalysis.score >= 80 ? "#10b981" : seoAnalysis.score >= 50 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - seoAnalysis.score / 100)}`}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-serif font-extrabold text-white leading-none">{seoAnalysis.score}%</span>
                <span className="text-[8px] font-sans font-bold text-[#c9c2ab]/60 uppercase tracking-widest mt-1">
                  {seoAnalysis.score >= 80 ? "Great" : seoAnalysis.score >= 50 ? "Needs Work" : "Poor / Unoptimized"}
                </span>
              </div>
            </div>

            {/* Score Breakdown Bar */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5 text-xs">
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Passed</span>
                <span className="font-bold text-green-400 font-mono">{seoAnalysis.passedCount} tests</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Failed</span>
                <span className="font-bold text-red-400 font-mono">{seoAnalysis.failedCount} tests</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Readability</span>
                <span className={`font-bold ${seoAnalysis.readability >= 60 ? "text-green-400" : "text-yellow-500"}`}>
                  {seoAnalysis.readability}/100
                </span>
              </div>
            </div>
          </div>

          {/* 2. FOCUS KEYWORD INPUT PANEL */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-4 space-y-3">
            <label className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-wider flex items-center space-x-1">
              <Sparkles size={12} />
              <span>Focus Keyword Optimization</span>
            </label>
            <input
              type="text"
              value={currentPost.focusKeyword || ""}
              onChange={(e) => handleUpdateField("focusKeyword", e.target.value)}
              className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-3 py-2 text-xs font-bold text-[#f2d98a] outline-none focus:border-[#d9b45c]"
              placeholder="e.g. Tajweed Rules, Quran Recitation..."
            />
            <p className="text-[10px] text-[#c9c2ab]">
              Enter the main search phrase you want this article to rank for in Google search results.
            </p>
          </div>

          {/* 3. LIVE GOOGLE SERP & SOCIAL SHARING PREVIEW */}
          <div className="bg-[#12141b]/80 border border-[#d9b45c]/10 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-2 gap-2">
              <span className="text-[10px] uppercase font-sans font-bold text-[#d9b45c] tracking-widest flex items-center space-x-1">
                <Eye size={12} />
                <span>SEO & Social Sharing Previews</span>
              </span>
              <div className="flex items-center space-x-1 bg-[#07080b] p-0.5 rounded-lg border border-white/5 text-[9px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewTab("google")}
                  className={`px-2 py-1 rounded-md transition-all ${previewTab === "google" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-white"}`}
                >
                  Google SERP
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("facebook")}
                  className={`px-2 py-1 rounded-md transition-all ${previewTab === "facebook" ? "bg-blue-600 text-white" : "text-[#c9c2ab] hover:text-white"}`}
                >
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("twitter")}
                  className={`px-2 py-1 rounded-md transition-all ${previewTab === "twitter" ? "bg-sky-500 text-white" : "text-[#c9c2ab] hover:text-white"}`}
                >
                  Twitter / X
                </button>
              </div>
            </div>

            {previewTab === "google" && (
              <div className="bg-white text-black p-3.5 rounded-xl space-y-1 text-left font-sans select-text shadow-md">
                <div className="text-[10px] text-[#202124] flex items-center space-x-1 font-sans">
                  <span>https://truthquranacademy.com</span>
                  <span className="text-gray-400 font-normal">› blog › {(currentPost.slug || "article").toLowerCase()}</span>
                </div>
                <h4 className="text-sm font-sans text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight line-clamp-1">
                  {currentPost.metaTitle || currentPost.title}
                </h4>
                <p className="text-[11px] text-[#4d5156] leading-normal line-clamp-2 font-light">
                  {currentPost.metaDescription || currentPost.excerpt || "No meta description provided."}
                </p>
              </div>
            )}

            {previewTab === "facebook" && (
              <div className="bg-[#18191a] text-[#e4e6eb] rounded-xl overflow-hidden border border-[#3a3b3c] shadow-lg font-sans text-xs">
                <div className="w-full aspect-[3/2] bg-[#242526] relative overflow-hidden">
                  {currentPost.coverImage ? (
                    <img src={currentPost.coverImage} alt={currentPost.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 space-y-1">
                      <ImageIcon size={24} />
                      <span className="text-[10px]">No 1200 × 800 px Featured Image Uploaded</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-[#f2d98a] px-2 py-0.5 rounded text-[8px] font-mono">
                    3:2 Aspect Ratio
                  </div>
                </div>
                <div className="p-3 bg-[#242526] space-y-1 border-t border-[#3a3b3c]">
                  <div className="text-[9px] uppercase font-mono text-gray-400 tracking-wider">TRUTHQURANACADEMY.COM</div>
                  <div className="font-bold text-xs text-white line-clamp-1">{currentPost.ogTitle || currentPost.metaTitle || currentPost.title}</div>
                  <p className="text-gray-400 text-[10px] line-clamp-2 leading-snug">{currentPost.ogDescription || currentPost.metaDescription || currentPost.excerpt}</p>
                </div>
              </div>
            )}

            {previewTab === "twitter" && (
              <div className="bg-black text-white rounded-2xl overflow-hidden border border-gray-800 shadow-lg font-sans text-xs">
                <div className="w-full aspect-[3/2] bg-gray-900 relative overflow-hidden">
                  {currentPost.coverImage ? (
                    <img src={currentPost.coverImage} alt={currentPost.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 space-y-1">
                      <ImageIcon size={24} />
                      <span className="text-[10px]">No 1200 × 800 px Featured Image Uploaded</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-[#f2d98a] px-2 py-0.5 rounded text-[8px] font-mono">
                    Summary Large Image (3:2)
                  </div>
                </div>
                <div className="p-3 space-y-1 bg-black">
                  <div className="text-[9px] text-gray-500 font-mono">truthquranacademy.com</div>
                  <div className="font-bold text-xs text-white line-clamp-1">{currentPost.twitterTitle || currentPost.title}</div>
                  <p className="text-gray-400 text-[10px] line-clamp-2">{currentPost.twitterDescription || currentPost.excerpt}</p>
                </div>
              </div>
            )}
          </div>

          {/* 4. REAL-TIME AUDIT CHECKS & ACTIONABLE RECOMMENDATIONS */}
          <div className="bg-[#12141b]/70 border border-[#d9b45c]/15 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-2">
              <span>SEO Audit Checklist</span>
              <span className="text-[10px] font-mono text-[#d9b45c]">{seoAnalysis.passedCount}/{seoAnalysis.rules.length} Passed</span>
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {seoAnalysis.rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 transition-all ${
                    rule.passed ? "bg-green-500/5 border-green-500/20 text-green-300" : "bg-red-500/5 border-red-500/20 text-red-300"
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{rule.label}</span>
                      <span className="text-[9px] font-mono text-[#c9c2ab]/60">+{rule.points} pts</span>
                    </div>
                    <p className="text-[10px] text-[#c9c2ab] leading-snug">{rule.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. EDIT META TITLE & DESCRIPTION SNIPPET */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#d9b45c] uppercase tracking-wider">Edit Snippet Metadata</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Meta Title (Google Title Tag)</label>
              <input
                type="text"
                value={currentPost.metaTitle || ""}
                onChange={(e) => handleUpdateField("metaTitle", e.target.value)}
                className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                placeholder="Google Meta Title..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Meta Description</label>
              <textarea
                rows={3}
                value={currentPost.metaDescription || ""}
                onChange={(e) => handleUpdateField("metaDescription", e.target.value)}
                className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white resize-none"
                placeholder="Meta description for search engine result snippet..."
              />
            </div>
          </div>

          {/* 6. PUBLISHING METADATA & POST SETTINGS PANEL */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-4 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-[#d9b45c] uppercase tracking-wider flex items-center space-x-1.5 border-b border-white/5 pb-2">
              <Calendar size={14} />
              <span>Publishing & Post Metadata</span>
            </h4>

            {/* Category Selection */}
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Article Category</label>
              <select
                value={currentPost?.category || "Tajweed Rules"}
                onChange={(e) => handleUpdateField("category", e.target.value)}
                className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#d9b45c]"
              >
                <option value="Tajweed Rules">Tajweed Rules</option>
                <option value="Quran Memorization Tips">Quran Memorization Tips</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Parenting Guide">Parenting Guide</option>
                <option value="Quranic Arabic">Quranic Arabic</option>
                <option value="Academy Lectures">Academy Lectures</option>
              </select>
            </div>

            {/* Publish Date */}
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Publish Date</label>
              <input
                type="text"
                value={currentPost?.date || ""}
                onChange={(e) => handleUpdateField("date", e.target.value)}
                className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="e.g. August 4, 2026"
              />
            </div>

            {/* Author Name */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Author Name</label>
                <input
                  type="text"
                  value={currentPost?.author?.name || ""}
                  onChange={(e) => handleUpdateField("author", { ...(currentPost?.author || {}), name: e.target.value })}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="Author name..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Author Role</label>
                <input
                  type="text"
                  value={currentPost?.author?.role || ""}
                  onChange={(e) => handleUpdateField("author", { ...(currentPost?.author || {}), role: e.target.value })}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="e.g. Lead Instructor"
                />
              </div>
            </div>

            {/* Reading Time */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Reading Time</label>
                <span className="text-[9px] font-mono text-[#d9b45c]">Auto: {contentStats.readingTime}</span>
              </div>
              <input
                type="text"
                value={currentPost?.readTime || contentStats.readingTime}
                onChange={(e) => handleUpdateField("readTime", e.target.value)}
                className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="e.g. 5 min read"
              />
            </div>

            {/* Article Tags */}
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Tags (Comma Separated)</label>
              <input
                type="text"
                value={currentPost?.tags ? currentPost.tags.join(", ") : ""}
                onChange={(e) => {
                  const arr = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                  handleUpdateField("tags", arr);
                }}
                className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="Tajweed, Quran, Memorization..."
              />
            </div>

            {/* Publishing Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleSaveArticle("draft")}
                className="flex-1 py-2.5 bg-[#07080b] hover:bg-white/5 text-[#c9c2ab] border border-white/10 rounded-xl font-bold text-xs transition-colors"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSaveArticle("published")}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-black rounded-xl font-extrabold text-xs shadow-lg hover:brightness-110 transition-all"
              >
                Publish Live →
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL 1: INTERNAL IMAGES MANAGER & INSERTER MODAL */}
      {showInternalImagesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/40 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <ImageIcon size={20} className="text-[#d9b45c]" />
                <h3 className="font-serif text-lg font-bold text-white">Internal Images Manager</h3>
              </div>
              <button onClick={() => setShowInternalImagesModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* DRAG & DROP INTERNAL IMAGE UPLOADER */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropInternal}
              className="border-2 border-dashed border-[#d9b45c]/40 hover:border-[#d9b45c] bg-[#07080b] p-5 rounded-2xl text-center space-y-2 cursor-pointer transition-all"
              onClick={() => internalFileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={internalFileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "internal")}
                accept="image/*"
                className="hidden"
              />
              <Upload size={24} className="mx-auto text-[#d9b45c]" />
              <div className="text-xs font-bold text-white">Upload New Image from Computer</div>
              <p className="text-[10px] text-[#c9c2ab]">Drag & Drop image files here or click to browse files</p>
            </div>

            {/* SELECT FROM MEDIA LIBRARY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#d9b45c] uppercase">Select Existing Image from Library</h4>
                <input
                  type="text"
                  value={internalImgSearch}
                  onChange={(e) => setInternalImgSearch(e.target.value)}
                  placeholder="Search media..."
                  className="bg-[#07080b] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                {(cmsData.mediaLibrary || []).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (selectedInternalImages.includes(m.url)) {
                        setSelectedInternalImages(selectedInternalImages.filter((u) => u !== m.url));
                      } else {
                        setSelectedInternalImages([...selectedInternalImages, m.url]);
                      }
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer h-24 transition-all ${
                      selectedInternalImages.includes(m.url) ? "border-[#d9b45c] scale-95" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                    {selectedInternalImages.includes(m.url) && (
                      <div className="absolute top-1 right-1 bg-[#d9b45c] text-black rounded-full p-0.5">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PROPERTIES CONFIGURATION FOR INSERTION */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/10">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Image Alignment</label>
                <select
                  value={imgAlign}
                  onChange={(e: any) => setImgAlign(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="center">Center (Block)</option>
                  <option value="left">Float Left</option>
                  <option value="right">Float Right</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Display Width</label>
                <select
                  value={imgWidth}
                  onChange={(e) => setImgWidth(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="100%">100% Full Width</option>
                  <option value="75%">75% Width</option>
                  <option value="50%">50% Medium Width</option>
                  <option value="25%">25% Small Thumbnail</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">ALT Text (SEO)</label>
                <input
                  type="text"
                  value={imgAltText}
                  onChange={(e) => setImgAltText(e.target.value)}
                  placeholder="Descriptive ALT text for search engines..."
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  value={imgCaptionText}
                  onChange={(e) => setImgCaptionText(e.target.value)}
                  placeholder="Visible caption underneath image..."
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowInternalImagesModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertSelectedInternalImages}
                disabled={selectedInternalImages.length === 0}
                className="px-5 py-2 bg-[#d9b45c] disabled:opacity-50 text-black font-bold text-xs rounded-xl hover:bg-[#f2d98a] transition-all"
              >
                Insert Selected ({selectedInternalImages.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERNAL LINK SEARCH MODAL */}
      {showInternalLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Link2 size={18} className="text-[#d9b45c]" />
                <h3 className="font-serif text-base font-bold text-white">Insert Internal Link</h3>
              </div>
              <button onClick={() => setShowInternalLinkModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 text-xs font-bold">
              <button
                onClick={() => setInternalLinkTab("posts")}
                className={`pb-2 px-3 border-b-2 ${internalLinkTab === "posts" ? "border-[#d9b45c] text-[#f2d98a]" : "border-transparent text-[#c9c2ab]"}`}
              >
                Blog Posts
              </button>
              <button
                onClick={() => setInternalLinkTab("courses")}
                className={`pb-2 px-3 border-b-2 ${internalLinkTab === "courses" ? "border-[#d9b45c] text-[#f2d98a]" : "border-transparent text-[#c9c2ab]"}`}
              >
                Courses
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {internalLinkTab === "posts" ? (
                posts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleInsertInternalLink(`https://truthquranacademy.com/blog/${p.slug || p.id}`, p.title)}
                    className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 rounded-xl border border-white/5 cursor-pointer flex items-center justify-between text-xs group"
                  >
                    <span className="font-bold text-white group-hover:text-[#f2d98a] truncate">{p.title}</span>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </div>
                ))
              ) : (
                [
                  { title: "Noorani Qaida Course", slug: "noorani-qaida" },
                  { title: "Tajweed Mastery Course", slug: "courses" },
                  { title: "Kids Online Quran Classes", slug: "kids-classes" }
                ].map((c) => (
                  <div
                    key={c.slug}
                    onClick={() => handleInsertInternalLink(`https://truthquranacademy.com/${c.slug}`, c.title)}
                    className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 rounded-xl border border-white/5 cursor-pointer flex items-center justify-between text-xs group"
                  >
                    <span className="font-bold text-white group-hover:text-[#f2d98a]">{c.title}</span>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EXTERNAL LINK MODAL */}
      {showExternalLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-blue-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <ExternalLink size={18} className="text-blue-400" />
                <h3 className="font-serif text-base font-bold text-white">Insert External Link</h3>
              </div>
              <button onClick={() => setShowExternalLinkModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Destination URL</label>
                <input
                  type="text"
                  value={extLinkUrl}
                  onChange={(e) => setExtLinkUrl(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Anchor Text</label>
                <input
                  type="text"
                  value={extLinkText}
                  onChange={(e) => setExtLinkText(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white"
                  placeholder="Link text..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowExternalLinkModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertExternalLink}
                className="px-5 py-2 bg-blue-500 text-black font-bold text-xs rounded-xl hover:bg-blue-400 transition-all"
              >
                Insert Reference Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: MEDIA LIBRARY SELECTOR MODAL */}
      {showMediaLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-base font-bold text-white">Select Image from Media Library</h3>
              <button onClick={() => setShowMediaLibraryModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
              {(cmsData.mediaLibrary || []).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (mediaTargetField === "featured") {
                      handleUpdateField("coverImage", m.url);
                      handleUpdateField("featuredImage", m.url);
                      showToast("Featured image set from Media Library!");
                    } else {
                      const imgHtml = `<figure class="my-6 text-center"><img src="${m.url}" alt="${m.title}" loading="lazy" class="rounded-2xl max-w-full mx-auto shadow-xl" /></figure>`;
                      handleInsertBlockHtml(imgHtml);
                    }
                    setShowMediaLibraryModal(false);
                  }}
                  className="rounded-xl overflow-hidden border border-white/10 hover:border-[#d9b45c] cursor-pointer h-28 group relative"
                >
                  <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">
                    Select
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE BUILDER MODAL 1: TABLE BUILDER */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border-2 border-blue-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <TableIcon size={18} className="text-blue-400" />
                <h3 className="font-serif text-base font-bold text-white">Table Block Builder</h3>
              </div>
              <button onClick={() => setShowTableModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Rows Count</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={tableRows}
                    onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Columns Count</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={tableCols}
                    onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-bold text-white">Include Header Row</label>
                <input
                  type="checkbox"
                  checked={tableHasHeader}
                  onChange={(e) => setTableHasHeader(e.target.checked)}
                  className="w-4 h-4 accent-[#d9b45c] rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Table Color Style</label>
                <select
                  value={tableStyle}
                  onChange={(e) => setTableStyle(e.target.value as any)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value="gold">Golden Naeemia Theme</option>
                  <option value="dark">Minimal Dark</option>
                  <option value="emerald">Emerald Green</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertCustomTable}
                className="px-5 py-2 bg-blue-500 text-black font-extrabold text-xs rounded-xl hover:bg-blue-400 transition-all"
              >
                Insert Table →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE BUILDER MODAL 2: BUTTON BUILDER */}
      {showButtonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border-2 border-amber-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles size={18} className="text-amber-400" />
                <h3 className="font-serif text-base font-bold text-white">Button Block Builder</h3>
              </div>
              <button onClick={() => setShowButtonModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Button Label Text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Button Link URL</label>
                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Button Theme</label>
                  <select
                    value={buttonStyle}
                    onChange={(e) => setButtonStyle(e.target.value as any)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="gold">Golden Filled</option>
                    <option value="outline">Golden Outline</option>
                    <option value="emerald">WhatsApp Emerald</option>
                    <option value="blue">Royal Blue</option>
                    <option value="dark">Dark Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Alignment</label>
                  <select
                    value={buttonAlign}
                    onChange={(e) => setButtonAlign(e.target.value as any)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-bold text-white">Open link in new tab (_blank)</label>
                <input
                  type="checkbox"
                  checked={buttonTargetBlank}
                  onChange={(e) => setButtonTargetBlank(e.target.checked)}
                  className="w-4 h-4 accent-[#d9b45c] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowButtonModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertCustomButton}
                className="px-5 py-2 bg-[#d9b45c] text-black font-extrabold text-xs rounded-xl hover:bg-[#f2d98a] transition-all"
              >
                Insert Button →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE BUILDER MODAL 3: FAQ BUILDER */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border-2 border-pink-500/50 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <FaqIcon size={18} className="text-pink-400" />
                <h3 className="font-serif text-base font-bold text-white">FAQ Schema Accordion Builder</h3>
              </div>
              <button onClick={() => setShowFaqModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {faqItems.map((item, index) => (
                <div key={index} className="p-4 bg-[#07080b] border border-white/10 rounded-2xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold text-[#d9b45c]">FAQ Item #{index + 1}</span>
                    {faqItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFaqItems(faqItems.filter((_, i) => i !== index))}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...faqItems];
                      updated[index].question = e.target.value;
                      setFaqItems(updated);
                    }}
                    placeholder="Enter question..."
                    className="w-full bg-[#12141b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  <textarea
                    rows={2}
                    value={item.answer}
                    onChange={(e) => {
                      const updated = [...faqItems];
                      updated[index].answer = e.target.value;
                      setFaqItems(updated);
                    }}
                    placeholder="Enter detailed answer..."
                    className="w-full bg-[#12141b] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setFaqItems([...faqItems, { question: "New FAQ Question?", answer: "Clear answer explaining..." }])}
                className="w-full py-2 bg-[#07080b] hover:bg-white/5 border border-dashed border-[#d9b45c]/40 text-[#f2d98a] font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
              >
                <Plus size={14} />
                <span>Add Question</span>
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <label className="text-xs font-bold text-white">Generate FAQPage Schema (JSON-LD)</label>
                <input
                  type="checkbox"
                  checked={faqIncludeSchema}
                  onChange={(e) => setFaqIncludeSchema(e.target.checked)}
                  className="w-4 h-4 accent-[#d9b45c] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowFaqModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertCustomFaq}
                className="px-5 py-2 bg-pink-500 text-black font-extrabold text-xs rounded-xl hover:bg-pink-400 transition-all"
              >
                Insert FAQ Block →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE BUILDER MODAL 4: EMBED BUILDER */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border-2 border-red-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Film size={18} className="text-red-400" />
                <h3 className="font-serif text-base font-bold text-white">Embed Block Builder</h3>
              </div>
              <button onClick={() => setShowEmbedModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Embed Type</label>
                <select
                  value={embedType}
                  onChange={(e) => setEmbedType(e.target.value as any)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value="youtube">YouTube Video</option>
                  <option value="vimeo">Vimeo Video</option>
                  <option value="googlemaps">Google Maps Embed</option>
                  <option value="custom">Custom Iframe / Code</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">
                  {embedType === "custom" ? "Iframe Code or URL" : "Media / Map Share URL"}
                </label>
                <input
                  type="text"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertCustomEmbed}
                className="px-5 py-2 bg-red-500 text-black font-extrabold text-xs rounded-xl hover:bg-red-400 transition-all"
              >
                Insert Embed Container →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE BUILDER MODAL 5: CTA BANNER BUILDER */}
      {showCtaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border-2 border-[#d9b45c]/50 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles size={18} className="text-[#d9b45c]" />
                <h3 className="font-serif text-base font-bold text-white">Call To Action Banner Builder</h3>
              </div>
              <button onClick={() => setShowCtaModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Headline</label>
                <input
                  type="text"
                  value={ctaTitle}
                  onChange={(e) => setCtaTitle(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={ctaDesc}
                  onChange={(e) => setCtaDesc(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={ctaBtnText}
                    onChange={(e) => setCtaBtnText(e.target.value)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Destination Link</label>
                  <input
                    type="text"
                    value={ctaBtnUrl}
                    onChange={(e) => setCtaBtnUrl(e.target.value)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowCtaModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertCustomCta}
                className="px-5 py-2 bg-[#d9b45c] text-black font-extrabold text-xs rounded-xl hover:bg-[#f2d98a] transition-all"
              >
                Insert Banner →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 3:2 FEATURED IMAGE CROPPING & OPTIMIZATION STUDIO */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141b] border-2 border-[#d9b45c]/50 rounded-3xl p-6 max-w-3xl w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Crop size={20} className="text-[#d9b45c]" />
                  <h3 className="font-serif text-lg font-bold text-white">3:2 Featured Image Cropper & Optimization Studio</h3>
                </div>
                <p className="text-[11px] text-[#c9c2ab] mt-0.5">
                  Rank Math SEO Standard: <span className="text-[#f2d98a] font-bold">1200 × 800 pixels</span> (Fixed 3:2 Aspect Ratio)
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setPendingCropImage(null);
                }}
                className="text-[#c9c2ab] hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* RESOLUTION STATS BANNER */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-[#07080b] p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] uppercase text-[#c9c2ab] block">Recommended Size</span>
                <span className="font-mono font-bold text-[#d9b45c]">1200 × 800 px</span>
              </div>
              <div className="bg-[#07080b] p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] uppercase text-[#c9c2ab] block">Aspect Ratio</span>
                <span className="font-mono font-bold text-[#d9b45c]">3:2 Standard</span>
              </div>
              <div className="bg-[#07080b] p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] uppercase text-[#c9c2ab] block">Target Format</span>
                <span className="font-mono font-bold text-green-400">Web-Optimized JPEG</span>
              </div>
              <div className="bg-[#07080b] p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] uppercase text-[#c9c2ab] block">Quality Compression</span>
                <span className="font-mono font-bold text-sky-400">{Math.round(cropQuality * 100)}% ({cropQuality < 0.9 ? "~150 KB" : "~250 KB"})</span>
              </div>
            </div>

            {/* LIVE 3:2 CROPPING PREVIEW VIEWPORT WITH MOUSE DRAG PANNING */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#c9c2ab]">
                <span className="font-bold text-white flex items-center space-x-1">
                  <Eye size={14} className="text-[#d9b45c]" />
                  <span>Interactive 3:2 Canvas Preview</span>
                </span>
                <span className="text-[10px] font-mono text-[#d9b45c]">
                  Tip: Drag image or use Zoom / Pan sliders to compose focal area
                </span>
              </div>

              <div
                className="relative w-full aspect-[3/2] bg-[#07080b] rounded-2xl overflow-hidden border-2 border-[#d9b45c]/50 cursor-grab active:cursor-grabbing select-none shadow-2xl"
                onMouseDown={(e) => {
                  setIsDraggingCanvas(true);
                  setDragStartPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  if (!isDraggingCanvas) return;
                  const deltaX = e.clientX - dragStartPos.x;
                  const deltaY = e.clientY - dragStartPos.y;
                  setCropPanX((prev) => Math.min(50, Math.max(-50, prev + deltaX * 0.15)));
                  setCropPanY((prev) => Math.min(50, Math.max(-50, prev + deltaY * 0.15)));
                  setDragStartPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseUp={() => setIsDraggingCanvas(false)}
                onMouseLeave={() => setIsDraggingCanvas(false)}
              >
                {/* IMAGE LAYER WITH TRANSFORM ZOOM & PAN */}
                {pendingCropImage || currentPost?.originalCoverImage || currentPost?.coverImage ? (
                  <img
                    src={pendingCropImage || currentPost?.originalCoverImage || currentPost?.coverImage}
                    alt="Crop preview"
                    className="w-full h-full object-cover transition-transform duration-75 pointer-events-none"
                    style={{
                      transform: `scale(${cropScale}) translate(${cropPanX}%, ${cropPanY}%)`,
                      filter: `brightness(${cropBrightness}%) contrast(${cropContrast}%) saturate(${cropSaturation}%)`
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#c9c2ab]">
                    <Upload size={32} className="text-[#d9b45c] mb-2" />
                    <span>No image selected for cropping</span>
                  </div>
                )}

                {/* RULE OF THIRDS GRID OVERLAY */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                  <div className="border-r border-b border-white/15" />
                  <div className="border-r border-b border-white/15" />
                  <div className="border-b border-white/15" />
                  <div className="border-r border-b border-white/15" />
                  <div className="border-r border-b border-white/15" />
                  <div className="border-b border-white/15" />
                  <div className="border-r border-white/15" />
                  <div className="border-r border-white/15" />
                  <div className="" />
                </div>

                {/* BADGE OVERLAY */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-[#d9b45c]/40 text-[#f2d98a] px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>Target Output: 1200 × 800 px (3:2)</span>
                </div>
              </div>
            </div>

            {/* CROP CONTROL SLIDERS & PRESETS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#07080b] p-4 rounded-2xl border border-white/10">
              
              {/* ZOOM & PAN CONTROLS */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#d9b45c] uppercase text-[10px] tracking-wider border-b border-white/5 pb-1">
                  Zoom & Pan Framing
                </h4>

                <div>
                  <div className="flex justify-between text-[10px] text-[#c9c2ab] mb-1 font-mono">
                    <span>Zoom Scale</span>
                    <span>{cropScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={3.0}
                    step={0.05}
                    value={cropScale}
                    onChange={(e) => setCropScale(parseFloat(e.target.value))}
                    className="w-full accent-[#d9b45c]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#c9c2ab] mb-1 font-mono">
                    <span>Horizontal Pan (X)</span>
                    <span>{cropPanX > 0 ? `+${cropPanX.toFixed(0)}%` : `${cropPanX.toFixed(0)}%`}</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    step={1}
                    value={cropPanX}
                    onChange={(e) => setCropPanX(parseFloat(e.target.value))}
                    className="w-full accent-[#d9b45c]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#c9c2ab] mb-1 font-mono">
                    <span>Vertical Pan (Y)</span>
                    <span>{cropPanY > 0 ? `+${cropPanY.toFixed(0)}%` : `${cropPanY.toFixed(0)}%`}</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    step={1}
                    value={cropPanY}
                    onChange={(e) => setCropPanY(parseFloat(e.target.value))}
                    className="w-full accent-[#d9b45c]"
                  />
                </div>
              </div>

              {/* IMAGE ADJUSTMENTS & ASPECT RATIO */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#d9b45c] uppercase text-[10px] tracking-wider border-b border-white/5 pb-1">
                  Color & Brightness Enhancements
                </h4>

                <div>
                  <div className="flex justify-between text-[10px] text-[#c9c2ab] mb-1 font-mono">
                    <span>Brightness</span>
                    <span>{cropBrightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    step={1}
                    value={cropBrightness}
                    onChange={(e) => setCropBrightness(parseInt(e.target.value))}
                    className="w-full accent-[#d9b45c]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#c9c2ab] mb-1 font-mono">
                    <span>Contrast</span>
                    <span>{cropContrast}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    step={1}
                    value={cropContrast}
                    onChange={(e) => setCropContrast(parseInt(e.target.value))}
                    className="w-full accent-[#d9b45c]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#c9c2ab] mb-1 font-mono">
                    <span>Saturation</span>
                    <span>{cropSaturation}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    step={1}
                    value={cropSaturation}
                    onChange={(e) => setCropSaturation(parseInt(e.target.value))}
                    className="w-full accent-[#d9b45c]"
                  />
                </div>
              </div>

            </div>

            {/* QUICK PRESETS & ASPECT RATIO SELECTOR */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold text-[#c9c2ab]">Target Ratio:</span>
                <select
                  value={cropAspectRatio}
                  onChange={(e: any) => setCropAspectRatio(e.target.value)}
                  className="bg-[#07080b] border border-[#d9b45c]/30 rounded-lg px-2.5 py-1 text-xs text-[#f2d98a] font-bold"
                >
                  <option value="3:2">3:2 (1200 × 800 px) [Recommended Rank Math Standard]</option>
                  <option value="16:9">16:9 (1200 × 675 px) [Widescreen Banner]</option>
                  <option value="1:1">1:1 (800 × 800 px) [Square Social]</option>
                  <option value="4:3">4:3 (1200 × 900 px) [Classic Photo]</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleQuickAutoCrop3by2}
                  className="px-3 py-1.5 bg-[#07080b] hover:bg-white/10 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg text-xs font-bold"
                >
                  Auto-Center 3:2 (1200×800)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropScale(1.0);
                    setCropPanX(0);
                    setCropPanY(0);
                    setCropBrightness(100);
                    setCropContrast(100);
                    setCropSaturation(100);
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] rounded-lg text-xs font-bold"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* FOOTER ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="text-[10px] text-[#c9c2ab] italic">
                Generates web-optimized JPEG at exact 1200 × 800 px resolution
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropModal(false);
                    setPendingCropImage(null);
                  }}
                  className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCropAndOptimize}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-black font-extrabold text-xs rounded-xl hover:brightness-110 transition-all flex items-center space-x-2 shadow-lg"
                >
                  <Check size={16} />
                  <span>Save & Apply 1200 × 800 px Optimized Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
