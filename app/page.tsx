"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Inter } from "next/font/google";
import {
  Search,
  Filter,
  Bell,
  User,
  Check,
  X,
  Clock,
  Star,
  Plus,
  DollarSign,
  MessageSquare,
  Calendar,
  Heart,
  Menu,
  Code,
  BookOpen,
  Briefcase,
  Sparkles,
  PenTool,
  Camera,
  Music,
  Bookmark,
  Flower,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// Types
type ServiceCategory =
  | "Tutoring"
  | "Home Repair"
  | "Web Development"
  | "Graphic Design"
  | "Cleaning"
  | "Cooking"
  | "Writing"
  | "Photography"
  | "Music"
  | "Translation"
  | "Personal Training"
  | "Gardening";

type PaymentType = "Money" | "Exchange";

type ServiceStatus = "Available" | "In Progress" | "Completed";

type TransactionStatus =
  | "Pending"
  | "Escrowed"
  | "Released"
  | "Disputed"
  | "Refunded"
  | "Cancelled"
  | "Completed";

interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  paymentType: PaymentType;
  location: string;
  userId: string;
  createdAt: Date;
  status: ServiceStatus;
  acceptsExchange: boolean;
  rating?: number;
  imageUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  rating: number;
  memberSince: Date;
  servicesOffered: number;
  servicesReceived: number;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

interface Transaction {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  escrowReleaseDate?: Date;
  notes?: string;
}

// Mock Data
const mockCategories: ServiceCategory[] = [
  "Tutoring",
  "Home Repair",
  "Web Development",
  "Graphic Design",
  "Cleaning",
  "Cooking",
  "Writing",
  "Photography",
  "Music",
  "Translation",
  "Personal Training",
  "Gardening",
];

const serviceImages: Record<ServiceCategory, string> = {
  "Web Development":
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&auto=format",
  "Graphic Design":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&auto=format",
  Tutoring:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&auto=format",
  Cleaning:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&auto=format",
  Cooking:
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&auto=format",
  Writing:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&auto=format",
  Photography:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&auto=format",
  Music:
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&auto=format",
  Translation:
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&h=400&auto=format",
  "Personal Training":
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&auto=format",
  Gardening:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&auto=format",
  "Home Repair":
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&auto=format",
};

const staticAvatars = {
  user1: "/api/placeholder/100/100",
  user2: "/api/placeholder/100/100",
  user3: "/api/placeholder/100/100",
  default: "/api/placeholder/100/100",
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatarUrl: staticAvatars.user1,
    bio: "Professional web developer with 5 years of experience",
    rating: 4.8,
    memberSince: new Date("2021-03-15"),
    servicesOffered: 24,
    servicesReceived: 3,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    avatarUrl: staticAvatars.user2,
    bio: "Certified math tutor and former high school teacher",
    rating: 4.9,
    memberSince: new Date("2020-05-22"),
    servicesOffered: 56,
    servicesReceived: 7,
  },
  {
    id: "3",
    name: "Sofia Rodriguez",
    email: "sofia@example.com",
    avatarUrl: staticAvatars.user3,
    bio: "Freelance graphic designer specializing in branding",
    rating: 4.7,
    memberSince: new Date("2022-01-10"),
    servicesOffered: 18,
    servicesReceived: 12,
  },
];

const mockServices: Service[] = [
  {
    id: "1",
    title: "Professional Web Development",
    description:
      "I can build responsive websites using modern frameworks like React, Vue, or Angular. Experience with e-commerce, blogs, and business sites.",
    category: "Web Development",
    price: 50,
    paymentType: "Money",
    location: "Remote",
    userId: "1",
    createdAt: new Date("2023-09-15"),
    status: "Available",
    acceptsExchange: true,
    rating: 4.8,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "2",
    title: "Math Tutoring for All Levels",
    description:
      "Experienced math tutor available for elementary to college-level mathematics. Specializing in algebra, calculus, and statistics.",
    category: "Tutoring",
    price: 30,
    paymentType: "Money",
    location: "Remote/In-person",
    userId: "2",
    createdAt: new Date("2023-09-10"),
    status: "Available",
    acceptsExchange: false,
    rating: 4.9,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "3",
    title: "Logo and Brand Identity Design",
    description:
      "Custom logo design and complete brand identity packages. Includes multiple concepts, revisions, and final files in all formats.",
    category: "Graphic Design",
    price: 250,
    paymentType: "Money",
    location: "Remote",
    userId: "3",
    createdAt: new Date("2023-09-20"),
    status: "Available",
    acceptsExchange: true,
    rating: 4.7,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "4",
    title: "House Cleaning Services",
    description:
      "Thorough house cleaning including dusting, vacuuming, mopping, and bathroom/kitchen sanitizing. Eco-friendly products available upon request.",
    category: "Cleaning",
    price: 25,
    paymentType: "Money",
    location: "Local only",
    userId: "1",
    createdAt: new Date("2023-09-18"),
    status: "Available",
    acceptsExchange: true,
    rating: 4.6,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "5",
    title: "Personal Chef for Special Events",
    description:
      "I'll cook a gourmet meal for your special occasion. Custom menus available, including vegetarian, vegan, and allergy-friendly options.",
    category: "Cooking",
    price: 100,
    paymentType: "Money",
    location: "Local only",
    userId: "3",
    createdAt: new Date("2023-09-12"),
    status: "Available",
    acceptsExchange: false,
    rating: 4.9,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "6",
    title: "Content Writing & Copywriting",
    description:
      "Professional writing for websites, blogs, social media, and marketing materials. SEO-optimized content that converts.",
    category: "Writing",
    price: 40,
    paymentType: "Money",
    location: "Remote",
    userId: "2",
    createdAt: new Date("2023-09-14"),
    status: "Available",
    acceptsExchange: true,
    rating: 4.7,
    imageUrl: "/api/placeholder/400/300",
  },
];

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Urgent: Need a Plumber Today",
    description:
      "Water leak in bathroom, need professional help ASAP. Willing to pay premium for quick service.",
    userId: "2",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
  },
  {
    id: "2",
    title: "Looking for Spanish Tutor",
    description:
      "Need someone to help with conversational Spanish twice a week. Preferably evenings.",
    userId: "1",
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    expiresAt: new Date(Date.now() + 172800000), // 48 hours from now
  },
  {
    id: "3",
    title: "Available for Weekend Moving Help",
    description:
      "I have a truck and can help with moving this weekend. Exchange or reasonable rates.",
    userId: "3",
    createdAt: new Date(Date.now() - 14400000), // 4 hours ago
    expiresAt: new Date(Date.now() + 259200000), // 72 hours from now
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    serviceId: "2",
    buyerId: "1",
    sellerId: "2",
    amount: 60, // 2 hours of tutoring
    status: "Escrowed",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000),
    escrowReleaseDate: new Date(Date.now() + 259200000), // 3 days from now
  },
  {
    id: "2",
    serviceId: "4",
    buyerId: "3",
    sellerId: "1",
    amount: 75, // 3 hours of cleaning
    status: "Released",
    createdAt: new Date(Date.now() - 604800000), // 7 days ago
    updatedAt: new Date(Date.now() - 518400000), // 6 days ago
    completedAt: new Date(Date.now() - 518400000), // 6 days ago
  },
  {
    id: "3",
    serviceId: "1",
    buyerId: "2",
    sellerId: "1",
    amount: 250, // 5 hours of web development
    status: "Pending",
    createdAt: new Date(Date.now() - 345600000), // 4 days ago
    updatedAt: new Date(Date.now() - 345600000),
  },
];

// Main Application Component
export default function Home() {
  // States
  const [activeTab, setActiveTab] = useState<
    "discover" | "alerts" | "myServices" | "messages" | "transactions"
  >("discover");
  const [services, setServices] = useState<Service[]>(
    mockServices.map((service) => ({
      ...service,
      imageUrl: serviceImages[service.category] || "/api/placeholder/400/300",
    }))
  );
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | "All"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [paymentType, setPaymentType] = useState<PaymentType | "All">("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);
  const [showEscrowPaymentModal, setShowEscrowPaymentModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hours, setHours] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "credit" | "paypal" | "bank"
  >("credit");
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  const CategoryIcon = ({ category }: { category: ServiceCategory }) => {
    switch (category) {
      case "Web Development":
        return <Code className="text-blue-500" size={14} />;
      case "Graphic Design":
        return <PenTool className="text-purple-500" size={14} />;
      case "Tutoring":
        return <BookOpen className="text-green-500" size={14} />;
      case "Cleaning":
        return <Sparkles className="text-cyan-500" size={14} />;
      case "Cooking":
        return <MessageSquare className="text-orange-500" size={14} />;
      case "Writing":
        return <PenTool className="text-indigo-500" size={14} />;
      case "Photography":
        return <Camera className="text-pink-500" size={14} />;
      case "Music":
        return <Music className="text-yellow-500" size={14} />;
      case "Translation":
        return <Bookmark className="text-red-500" size={14} />;
      case "Personal Training":
        return <Heart className="text-rose-500" size={14} />;
      case "Gardening":
        return <Flower className="text-emerald-500" size={14} />;
      default:
        return <Briefcase className="text-gray-500" size={14} />;
    }
  };

  const [newService, setNewService] = useState<Partial<Service>>({
    title: "",
    description: "",
    category: "Web Development",
    price: 0,
    paymentType: "Money",
    location: "",
    acceptsExchange: false,
  });

  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    title: "",
    description: "",
  });

  useEffect(() => {
    const updatedServices = mockServices.map((service) => ({
      ...service,
      imageUrl: serviceImages[service.category] || "/api/placeholder/400/300",
    }));
    setServices(updatedServices);

    //const imageUrls = updatedServices.map((service) => service.imageUrl);
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedCategory, searchTerm, priceRange, paymentType, services]);

  useEffect(() => {
    const initialLoadingState = services.reduce(
      (acc, service) => ({ ...acc, [service.id]: false }),
      {}
    );
    setImagesLoaded(initialLoadingState);
  }, [services]);

  const filterServices = () => {
    let filtered = [...services];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term)
      );
    }

    filtered = filtered.filter(
      (service) =>
        service.price >= priceRange[0] && service.price <= priceRange[1]
    );

    if (paymentType !== "All") {
      filtered = filtered.filter(
        (service) => service.paymentType === paymentType
      );
    }

    setFilteredServices(filtered);
  };

  const handleServiceDetail = (service: Service) => {
    setSelectedService(service);
    setShowServiceDetailModal(true);
  };

  const handleEscrowPayment = (service: Service) => {
    setSelectedService(service);
    setHours(1);
    setShowEscrowPaymentModal(true);
  };

  const createEscrowPayment = () => {
    if (!selectedService) return;

    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      serviceId: selectedService.id,
      buyerId: currentUser.id,
      sellerId: selectedService.userId,
      amount: selectedService.price * hours,
      status: "Escrowed",
      createdAt: new Date(),
      updatedAt: new Date(),
      escrowReleaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };

    setTransactions([...transactions, newTransaction]);
    setShowEscrowPaymentModal(false);

    // const updatedServices = services.map((service) =>
    //   service.id === selectedService.id
    //     ? { ...service, status: "In Progress" as ServiceStatus }
    //     : service
    // );

    alert(
      `Payment of $${newTransaction.amount} is now in escrow. It will be released when the service is confirmed complete.`
    );
  };

  const releaseEscrowPayment = (transaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === transaction.id
        ? {
            ...t,
            status: "Released" as TransactionStatus,
            updatedAt: new Date(),
            completedAt: new Date(),
          }
        : t
    );
    setTransactions(updatedTransactions);

    // Update service status
    const updatedServices = services.map((service) =>
      service.id === transaction.serviceId
        ? { ...service, status: "Completed" as ServiceStatus }
        : service
    );
    setServices(updatedServices);

    // Show confirmation
    alert(`Payment released to service provider. Transaction completed.`);
  };

  // Form Handlers
  const handleNewServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newServiceData: Service = {
      id: (services.length + 1).toString(),
      title: newService.title || "",
      description: newService.description || "",
      category: newService.category as ServiceCategory,
      price: newService.price || 0,
      paymentType: newService.paymentType as PaymentType,
      location: newService.location || "",
      userId: currentUser.id,
      createdAt: new Date(),
      status: "Available",
      acceptsExchange: Boolean(newService.acceptsExchange),
      imageUrl: "/api/placeholder/400/300",
    };

    setServices([newServiceData, ...services]);
    setShowNewServiceModal(false);
    setNewService({
      title: "",
      description: "",
      category: "Web Development",
      price: 0,
      paymentType: "Money",
      location: "",
      acceptsExchange: false,
    });
  };

  const handleNewAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAlertData: Alert = {
      id: (alerts.length + 1).toString(),
      title: newAlert.title || "",
      description: newAlert.description || "",
      userId: currentUser.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
    };

    setAlerts([newAlertData, ...alerts]);
    setShowNewAlertModal(false);
    setNewAlert({
      title: "",
      description: "",
    });
  };

  const ImageLoader = ({
    src,
    alt,
    className,
    objectFit = "cover",
  }: {
    src: string | undefined;
    alt?: string;
    className?: string;
    objectFit?: string;
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const imageSrc = src || "/api/placeholder/400/300";

    return (
      <div className={`relative ${className}`}>
        {/* Placeholder showing while image loads */}
        <div
          className={`absolute inset-0 bg-gray-100 flex items-center justify-center transition-opacity duration-300 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        >
          <ImageIcon className="text-gray-300" size={32} />
        </div>

        <img
          src={hasError ? "/api/placeholder/400/300" : imageSrc}
          alt={alt || "Image"}
          className={`w-full h-full object-${objectFit} transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => {
            setIsLoaded(true);
          }}
          onError={() => {
            console.error(`Failed to load image: ${src}`);
            setHasError(true);
          }}
        />
      </div>
    );
  };

  const renderDiscoverTab = () => (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            className="px-4 py-2 flex items-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setShowFilterModal(true)}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as ServiceCategory | "All")
            }
          >
            <option value="All">All Categories</option>
            {mockCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <ImageLoader
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-48"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {service.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  {service.rating && (
                    <>
                      <Star
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="ml-1">{service.rating}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center">
                  <CategoryIcon category={service.category} />
                  <span className="ml-1">{service.category}</span>
                </span>
                <span className="mx-2">•</span>
                <span>{service.location}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {service.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center font-semibold text-gray-800">
                  <DollarSign size={18} className="text-green-600" />
                  {service.price}/hr
                </div>
                <div className="space-x-2">
                  <button
                    className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                    onClick={() => handleServiceDetail(service)}
                  >
                    Details
                  </button>
                  <button
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => handleEscrowPayment(service)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No services found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );

  const renderAlertsTab = () => (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Community Alerts
        </h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={() => setShowNewAlertModal(true)}
        >
          <Plus size={16} />
          <span>Post Alert</span>
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">
                {alert.title}
              </h3>
              <span className="text-xs text-gray-500">
                {Math.floor((Date.now() - alert.createdAt.getTime()) / 3600000)}{" "}
                hours ago
              </span>
            </div>

            <p className="text-gray-600 my-2">{alert.description}</p>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={14} />
                <span className="ml-1">
                  Expires in{" "}
                  {Math.ceil(
                    (alert.expiresAt.getTime() - Date.now()) / 3600000
                  )}{" "}
                  hours
                </span>
              </div>

              {/* <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                Respond
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bell size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No active alerts
          </h3>
          <p className="text-gray-500">
            Post an alert to request services or share offerings
          </p>
        </div>
      )}
    </div>
  );

  const renderMyServicesTab = () => {
    const userServices = services.filter(
      (service) => service.userId === currentUser.id
    );

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Services</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => setShowNewServiceModal(true)}
          >
            <Plus size={16} />
            <span>Create Service</span>
          </button>
        </div>

        {userServices.length > 0 ? (
          <div className="space-y-4">
            {userServices.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <ImageLoader
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full md:w-40 h-32 rounded-lg"
                  />

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {service.title}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 my-2">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs mr-2">
                        {service.category}
                      </span>
                      <span className="mr-2">•</span>
                      <span className="font-medium text-green-600">
                        ${service.price}/hr
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        Pause
                      </button>
                      <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="text-right mt-4 md:mt-0">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium inline-block mb-2
                    ${
                      service.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : service.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                    >
                      {service.status}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {service.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageSquare size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No services created
            </h3>
            <p className="text-gray-500">
              Create your first service to start offering your skills
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setShowNewServiceModal(true)}
            >
              Create Service
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTransactionsTab = () => {
    const userTransactions = transactions.filter(
      (transaction) =>
        transaction.buyerId === currentUser.id ||
        transaction.sellerId === currentUser.id
    );

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            My Transactions
          </h2>
        </div>

        {userTransactions.length > 0 ? (
          <div className="space-y-4">
            {userTransactions.map((transaction) => {
              const relatedService = services.find(
                (service) => service.id === transaction.serviceId
              );
              const isBuyer = transaction.buyerId === currentUser.id;
              const otherUser = mockUsers.find(
                (user) =>
                  user.id ===
                  (isBuyer ? transaction.sellerId : transaction.buyerId)
              );

              return (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {relatedService?.title || "Service"}
                        </h3>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${
                          transaction.status === "Escrowed"
                            ? "bg-blue-100 text-blue-800"
                            : transaction.status === "Released" ||
                                transaction.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "Disputed"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                        >
                          {transaction.status}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 my-2">
                        <span className="font-medium">
                          {isBuyer ? "Purchased from" : "Sold to"}:{" "}
                          {otherUser?.name}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 my-2">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          Created: {transaction.createdAt.toLocaleDateString()}
                        </span>
                        {transaction.completedAt && (
                          <>
                            <span className="mx-2">•</span>
                            <Check size={14} className="mr-1 text-green-500" />
                            <span>
                              Completed:{" "}
                              {transaction.completedAt.toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center font-semibold text-gray-800 mt-2">
                        <DollarSign size={18} className="text-green-600" />
                        {transaction.amount.toFixed(2)}
                      </div>

                      {transaction.status === "Escrowed" &&
                        transaction.escrowReleaseDate && (
                          <div className="text-sm text-orange-600 mt-2">
                            <Clock size={14} className="inline mr-1" />
                            Auto-release on{" "}
                            {transaction.escrowReleaseDate.toLocaleDateString()}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 justify-center">
                      {transaction.status === "Escrowed" &&
                        transaction.sellerId === currentUser.id && (
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            onClick={() => releaseEscrowPayment(transaction)}
                          >
                            Confirm Completion
                          </button>
                        )}

                      {/* {transaction.status === "Escrowed" && (
                        <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                          Request Support
                        </button>
                      )} */}

                      {/* {(transaction.status === "Released" ||
                        transaction.status === "Completed") && (
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                          View Receipt
                        </button>
                      )} */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <DollarSign size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-500">
              Your transaction history will appear here once you book a service
              or sell your skills
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setActiveTab("discover")}
            >
              Discover Services
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEscrowPaymentModal = () => {
    if (!selectedService) return null;

    const totalAmount = selectedService.price * hours;

    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${showEscrowPaymentModal ? "block" : "hidden"}`}
      >
        <div className="bg-white rounded-xl p-6 max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Secure Payment
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowEscrowPaymentModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">
              Service Details
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-800 mb-1">
                {selectedService.title}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {selectedService.category}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">${selectedService.price}/hr</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">
              Payment Details
            </h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours to Book
              </label>
              <div className="flex items-center">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-l-lg text-gray-600 hover:bg-gray-100"
                  onClick={() => setHours(Math.max(1, hours - 1))}
                  type="button"
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-20 text-center py-1 border-t border-b border-gray-300 focus:outline-none"
                  min="1"
                  value={hours}
                  onChange={(e) =>
                    setHours(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <button
                  className="px-3 py-1 border border-gray-300 rounded-r-lg text-gray-600 hover:bg-gray-100"
                  onClick={() => setHours(hours + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Rate × Hours:</span>
                <span className="font-medium">
                  ${selectedService.price} × {hours}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 text-lg">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Payment Method</h4>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={paymentMethod === "credit"}
                  onChange={() => setPaymentMethod("credit")}
                />
                <span className="ml-2 flex-grow">Credit/Debit Card</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                <span className="ml-2 flex-grow">PayPal</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />
                <span className="ml-2 flex-grow">Bank Transfer</span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-blue-600">
                <Check size={18} />
              </div>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Secure Escrow Payment</p>
                <p>
                  Your payment will be held securely in escrow until you confirm
                  the service has been completed satisfactorily.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowEscrowPaymentModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={createEscrowPayment}
            >
              Pay Securely
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceDetailModal = () => {
    if (!selectedService) return null;

    const serviceProvider = mockUsers.find(
      (user) => user.id === selectedService.userId
    );

    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${showServiceDetailModal ? "block" : "hidden"}`}
      >
        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <ImageLoader
              src={selectedService.imageUrl}
              alt={selectedService.title}
              className="w-full h-64"
            />
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md text-gray-500 hover:text-gray-700"
              onClick={() => setShowServiceDetailModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {selectedService.title}
            </h2>

            <div className="flex items-center mb-4">
              <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                {selectedService.category}
              </div>
              <span className="mx-2 text-gray-300">•</span>
              <div className="flex items-center text-sm text-gray-600">
                {selectedService.rating && (
                  <>
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="ml-1">{selectedService.rating}</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-gray-600">{selectedService.description}</p>
            </div>

            {serviceProvider && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Service Provider
                </h3>
                <div className="flex items-center">
                  <img
                    src={serviceProvider.avatarUrl}
                    alt={serviceProvider.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      {serviceProvider.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Member since{" "}
                      {serviceProvider.memberSince.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {serviceProvider.servicesOffered} services offered
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-200 pt-6 mt-6">
              <div className="mb-4 md:mb-0">
                <div className="text-sm text-gray-500">Price</div>
                <div className="text-3xl font-bold text-gray-800">
                  ${selectedService.price}
                  <span className="text-lg font-normal text-gray-500">/hr</span>
                </div>
                {selectedService.acceptsExchange && (
                  <div className="text-sm text-green-600 mt-1">
                    Open to service exchange
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    setShowServiceDetailModal(false);
                  }}
                >
                  Contact Provider
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setShowServiceDetailModal(false);
                    handleEscrowPayment(selectedService);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNewAlertModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${showNewAlertModal ? "block" : "hidden"}`}
    >
      <div className="bg-white rounded-xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Post Community Alert
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowNewAlertModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleNewAlertSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Need Plumber Urgently"
              required
              value={newAlert.title}
              onChange={(e) =>
                setNewAlert({ ...newAlert, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Describe what you need or are offering..."
              required
              value={newAlert.description}
              onChange={(e) =>
                setNewAlert({ ...newAlert, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="alert-expire"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <label
              htmlFor="alert-expire"
              className="ml-2 text-sm text-gray-600"
            >
              Automatically expire after 24 hours
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowNewAlertModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderNewServiceModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${showNewServiceModal ? "block" : "hidden"}`}
    >
      <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Create New Service
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowNewServiceModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleNewServiceSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Professional Web Development"
              required
              value={newService.title}
              onChange={(e) =>
                setNewService({ ...newService, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newService.category}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  category: e.target.value as ServiceCategory,
                })
              }
            >
              {mockCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Describe your service in detail..."
              required
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($ per hour)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
                value={newService.price}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newService.paymentType}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    paymentType: e.target.value as PaymentType,
                  })
                }
              >
                <option value="Money">Money</option>
                <option value="Exchange">Exchange</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Remote, Local only, etc."
              required
              value={newService.location}
              onChange={(e) =>
                setNewService({ ...newService, location: e.target.value })
              }
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="accepts-exchange"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                checked={newService.acceptsExchange}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    acceptsExchange: e.target.checked,
                  })
                }
              />
            </div>
            <label
              htmlFor="accepts-exchange"
              className="ml-2 text-sm text-gray-600"
            >
              I am open to service exchange in addition to monetary payment
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowNewServiceModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderFilterModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${showFilterModal ? "block" : "hidden"}`}
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowFilterModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as ServiceCategory | "All")
              }
            >
              <option value="All">All Categories</option>
              {mockCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value) || 300,
                  ])
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={paymentType === "All"}
                  onChange={() => setPaymentType("All")}
                />
                <span className="ml-2 text-sm">All</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={paymentType === "Money"}
                  onChange={() => setPaymentType("Money")}
                />
                <span className="ml-2 text-sm">Money only</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={paymentType === "Exchange"}
                  onChange={() => setPaymentType("Exchange")}
                />
                <span className="ml-2 text-sm">Exchange</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                setSelectedCategory("All");
                setPriceRange([0, 300]);
                setPaymentType("All");
              }}
            >
              Reset
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowFilterModal(false)}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Main layout rendering
  return (
    <main className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">SkillSwap</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                className={`px-3 py-2 text-sm font-medium ${activeTab === "discover" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("discover")}
              >
                Discover
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium ${activeTab === "alerts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("alerts")}
              >
                Alerts
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium ${activeTab === "myServices" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("myServices")}
              >
                My Services
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium ${activeTab === "transactions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("transactions")}
              >
                Transactions
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <nav className="flex flex-col space-y-3">
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === "discover" ? "text-blue-600 bg-blue-50 rounded-md" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("discover");
                setIsMobileMenuOpen(false);
              }}
            >
              Discover
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === "alerts" ? "text-blue-600 bg-blue-50 rounded-md" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("alerts");
                setIsMobileMenuOpen(false);
              }}
            >
              Alerts
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === "myServices" ? "text-blue-600 bg-blue-50 rounded-md" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("myServices");
                setIsMobileMenuOpen(false);
              }}
            >
              My Services
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === "transactions" ? "text-blue-600 bg-blue-50 rounded-md" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("transactions");
                setIsMobileMenuOpen(false);
              }}
            >
              Transactions
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "discover" && renderDiscoverTab()}
        {activeTab === "alerts" && renderAlertsTab()}
        {activeTab === "myServices" && renderMyServicesTab()}
        {activeTab === "transactions" && renderTransactionsTab()}
      </div>

      {/* Modals */}
      {renderFilterModal()}
      {renderNewServiceModal()}
      {renderNewAlertModal()}
      {renderServiceDetailModal()}
      {renderEscrowPaymentModal()}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                SkillSwap
              </h3>
              <p className="text-gray-600 text-sm">
                Exchange skills and services with people in your community.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Discover</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Browse Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 SkillSwap. All rights reserved.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
