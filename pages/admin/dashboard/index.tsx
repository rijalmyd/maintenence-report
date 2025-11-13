import AdminLayout from "@/components/layout/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">
                Total Revenue
              </CardDescription>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-bold">$45,231</CardTitle>
            <p className="text-xs text-green-600 font-medium mt-1">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">
                Active Users
              </CardDescription>
              <Users className="w-4 h-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-bold">2,350</CardTitle>
            <p className="text-xs text-green-600 font-medium mt-1">
              +180 new users
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">
                Total Orders
              </CardDescription>
              <ShoppingCart className="w-4 h-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-bold">1,234</CardTitle>
            <p className="text-xs text-red-600 font-medium mt-1">
              -4.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">
                Products
              </CardDescription>
              <Package className="w-4 h-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-bold">567</CardTitle>
            <p className="text-xs text-green-600 font-medium mt-1">
              +12 new products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  icon: Users,
                  color: "bg-blue-100 text-blue-600",
                  title: "New user registered",
                  desc: "Sarah Wilson joined the platform",
                  time: "2 hours ago",
                },
                {
                  icon: ShoppingCart,
                  color: "bg-green-100 text-green-600",
                  title: "New order placed",
                  desc: "Order #1234 received",
                  time: "4 hours ago",
                },
                {
                  icon: Package,
                  color: "bg-purple-100 text-purple-600",
                  title: "Product updated",
                  desc: "Premium Plan modified",
                  time: "6 hours ago",
                },
                {
                  icon: TrendingUp,
                  color: "bg-orange-100 text-orange-600",
                  title: "Revenue milestone",
                  desc: "Reached $50k this month",
                  time: "1 day ago",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 pb-4 border-b last:border-0"
                  >
                    <div
                      className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {item.desc}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-bold text-gray-900">3.24%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "32%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Order Value</span>
                <span className="text-sm font-bold text-gray-900">$89.50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Customer Satisfaction
                </span>
                <span className="text-sm font-bold text-gray-900">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: "96%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
