import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Parametres = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Paramètres globaux</h1>
        <p className="text-muted-foreground mt-1">Espace réservé au Super Administrateur.</p>
      </motion.div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Configuration active</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span>Période d'inscription</span>
            <Badge variant="outline">Ouverte</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span>Règle d'âge</span>
            <Badge variant="outline">2012 → 2019</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span>Gestion des listes</span>
            <Badge variant="outline">Automatique</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Parametres;
