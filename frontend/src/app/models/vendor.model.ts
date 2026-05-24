export interface VendorCategory {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  categoryId: string;
  category: VendorCategory;
  location: string | null;
  discount: string;
  imageUrl: string | null;
  mapsUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicVendor {
  id: string;
  name: string;
  categoryName: string;
  location: string | null;
  discount: string;
  imageUrl: string | null;
  mapsUrl: string | null;
}

export interface CreateVendorDto {
  name: string;
  categoryId: string;
  discount: string;
  location?: string;
  imageUrl?: string;
  mapsUrl?: string;
}

export interface UpdateVendorDto {
  name?: string;
  categoryId?: string;
  discount?: string;
  location?: string;
  imageUrl?: string;
  mapsUrl?: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}
