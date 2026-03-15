import { motion } from "framer-motion";
import { Users, ListChecks, Clock3, CheckSquare, AlertTriangle, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useInscriptions } from "@/context/InscriptionsContext";
import { useNavigate } from "react-router-dom";
import { STATUS_BADGE_CLASS, STATUS_LABELS, RELATION_LABELS } from "@/types/app";

const SuperAdminDashboard = () => {
  const { users } = useAuth();
  const { inscriptions } = useInscriptions();
  const navigate = useNavigate();

  const listePrincipale = inscriptions.filter((i) => i.listType === "principale").length;
  const listeAttente1 = inscriptions.filter((i) => i.listType === "attente_1").length;
  const listeAttente2 = inscriptions.filter((i) => i.listType === "attente_2").length;
  const pending = inscriptions.filter((i) => i.status === "en_attente").length;
  const validated = inscriptions.filter((i) => i.status === "validee").length;

  const kpis = [
    { label: "Liste Principale", value: listePrincipale, icon: CheckSquare, tone: "text-success" },
    { label: "Liste d'attente N°1", value: listeAttente1, icon: Clock3, tone: "text-warning" },
    { label: "Liste d'attente N°2", value: listeAttente2, icon: AlertTriangle, tone: "text-destructive" },
    { label: "Utilisateurs totals", value: users.length, icon: Users, tone: "text-primary" },
    { label: "Inscriptions globales", value: inscriptions.length, icon: ListChecks, tone: "text-secondary" },
  ];

  const recentInscriptions = [...inscriptions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Espace Super Administrateur</h1>
        <p className="text-muted-foreground mt-1">Accès global aux utilisateurs, inscriptions et validation.</p>
      </motion.div>

      {/* 5 KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi, index) => (
          <motion.div key={kpi.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.07 }}>
            <Card className="glass-card h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <kpi.icon className={`w-7 h-7 ${kpi.tone}`} />
                <p className="text-3xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/liste-inscriptions")}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Demandes en attente</p>
                <p className="text-2xl font-bold text-warning">{pending}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
          <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/gestion-listes")}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Demandes validées</p>
                <p className="text-2xl font-bold text-success">{validated}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/utilisateurs")}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Gérer les utilisateurs</p>
                <p className="text-2xl font-bold text-primary">{users.length}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Inscriptions */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-lg">Dernières inscriptions</CardTitle>
            <Button variant="ghost" size="sm" className="text-secondary" onClick={() => navigate("/dashboard/liste-inscriptions")}>
              Tout voir
            </Button>
          </CardHeader>
          <CardContent>
            {recentInscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune inscription.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Enfant</TableHead>
                    <TableHead>Lien</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInscriptions.map((ins) => (
                    <TableRow key={ins.id}>
                      <TableCell className="font-mono text-xs">{ins.parentMatricule}</TableCell>
                      <TableCell className="text-sm">{ins.parentNom} {ins.parentPrenom}</TableCell>
                      <TableCell className="text-sm">{ins.childNom} {ins.childPrenom}</TableCell>
                      <TableCell className="text-sm">{RELATION_LABELS[ins.childRelation]}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${STATUS_BADGE_CLASS[ins.status]}`}>{STATUS_LABELS[ins.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(ins.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
        <Card className="gradient-accent border-0 text-accent-foreground">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Vue d'ensemble
              </h3>
              <p className="text-sm opacity-90 mt-1">
                {inscriptions.length} inscription(s) au total • {pending} en attente de validation • {users.length} utilisateur(s) enregistré(s)
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard/statistiques")} className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
              Voir les statistiques
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuperAdminDashboard;
