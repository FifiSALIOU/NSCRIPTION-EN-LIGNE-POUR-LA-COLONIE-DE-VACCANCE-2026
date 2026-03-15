import { motion } from "framer-motion";
import { BarChart3, Users, Baby, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useInscriptions } from "@/context/InscriptionsContext";

const Statistiques = () => {
  const { inscriptions } = useInscriptions();

  const principale = inscriptions.filter((i) => i.listType === "principale").length;
  const attente1 = inscriptions.filter((i) => i.listType === "attente_1").length;
  const attente2 = inscriptions.filter((i) => i.listType === "attente_2").length;
  const parents = new Set(inscriptions.map((i) => i.parentMatricule)).size;

  const pieData = [
    { name: "Principale", value: principale, color: "hsl(225, 85%, 10%)" },
    { name: "Attente N°1", value: attente1, color: "hsl(30, 100%, 50%)" },
    { name: "Attente N°2", value: attente2, color: "hsl(220, 15%, 70%)" },
  ];

  // Group by service
  const serviceMap: Record<string, number> = {};
  inscriptions.forEach((ins) => {
    const key = ins.parentService || "Autre";
    serviceMap[key] = (serviceMap[key] || 0) + 1;
  });
  const barData = Object.entries(serviceMap).map(([service, inscrits]) => ({ service: service.length > 12 ? service.substring(0, 12) + "…" : service, inscrits }));

  const stats = [
    { label: "Total inscrits", value: inscriptions.length, icon: Baby, color: "text-secondary" },
    { label: "Parents", value: parents, icon: Users, color: "text-primary" },
    { label: "Liste principale", value: principale, icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Statistiques</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble des inscriptions</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary" /> Inscriptions par service
              </CardTitle>
            </CardHeader>
            <CardContent>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                    <XAxis dataKey="service" fontSize={11} />
                    <YAxis fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="inscrits" fill="hsl(30, 100%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Aucune donnée</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">Répartition par liste</CardTitle>
            </CardHeader>
            <CardContent>
              {inscriptions.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Aucune donnée</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Statistiques;
