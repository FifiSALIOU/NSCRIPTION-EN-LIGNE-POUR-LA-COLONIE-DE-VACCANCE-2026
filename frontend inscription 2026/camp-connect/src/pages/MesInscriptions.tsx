import { motion } from "framer-motion";
import { Baby, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useInscriptions } from "@/context/InscriptionsContext";
import { LIST_LABELS, RELATION_LABELS, STATUS_BADGE_CLASS, STATUS_LABELS } from "@/types/app";

const MesInscriptions = () => {
  const { currentUser } = useAuth();
  const { getParentInscriptions } = useInscriptions();

  const myInscriptions = currentUser ? getParentInscriptions(currentUser.id) : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Mes inscriptions</h1>
        <p className="text-muted-foreground mt-1">Suivez l'état de vos demandes d'inscription</p>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" /> Liste des inscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myInscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune inscription soumise.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Réf.</TableHead>
                    <TableHead>Enfant</TableHead>
                    <TableHead>Naissance</TableHead>
                    <TableHead>Lien</TableHead>
                    <TableHead>Liste</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myInscriptions.map((ins) => (
                    <TableRow key={ins.id}>
                      <TableCell className="font-mono text-xs">{ins.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Baby className="w-4 h-4 text-muted-foreground" />
                          {ins.childNom} {ins.childPrenom}
                          {ins.isTitulaire && <span className="text-xs font-medium text-secondary">(Titulaire)</span>}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(ins.childBirthDate).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{RELATION_LABELS[ins.childRelation]}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{LIST_LABELS[ins.listType]}</Badge></TableCell>
                      <TableCell><Badge className={`text-xs ${STATUS_BADGE_CLASS[ins.status]}`}>{STATUS_LABELS[ins.status]}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MesInscriptions;
