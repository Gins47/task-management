import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private serviceName: string;

  constructor(baseURL: string, serviceName: string = "ApiClient") {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000,
    });
    this.serviceName = serviceName;
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      this.handleSuccess.bind(this),
      this.handleError.bind(this)
    );
  }

  private handleSuccess(response: AxiosResponse) {
    return response.data;
  }

  private handleError(error: AxiosError) {
    console.error(`[${this.serviceName}] Error:`, error);
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        message: error.response.data || "Server Error",
      });
    } else if (error.request) {
      return Promise.reject({ message: "Network Error" });
    } else {
      return Promise.reject({ message: error.message });
    }
  }

  public get<T>(url: string, params?: object): Promise<T> {
    return this.axiosInstance.get(url, { params });
  }

  public post<T>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.post(url, data);
  }

  public put<T>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.put(url, data);
  }

  public delete<T>(url: string): Promise<T> {
    return this.axiosInstance.delete(url);
  }
}
