import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Plus, School } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Workshop {
  id: string
  name: string
  description: string
  studentsCount: number
  createdAt: Date
}

export default function Dashboard() {
  const [workshops, setWorkshops] = useState<Workshop[]>([
    {
      id: '1',
      name: 'Mathématiques',
      description: 'Atelier de résolution de problèmes mathématiques',
      studentsCount: 24,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Sciences',
      description: 'Expériences et découvertes scientifiques',
      studentsCount: 22,
      createdAt: new Date('2024-01-16')
    }
  ])

  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    description: ''
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateWorkshop = () => {
    if (newWorkshop.name.trim()) {
      const workshop: Workshop = {
        id: Date.now().toString(),
        name: newWorkshop.name,
        description: newWorkshop.description,
        studentsCount: 0,
        createdAt: new Date()
      }
      setWorkshops([...workshops, workshop])
      setNewWorkshop({ name: '', description: '' })
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <School className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestionnaire de Classe
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Organisez vos ateliers, suivez le travail de vos élèves et évaluez leurs réalisations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Ateliers Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{workshops.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Élèves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workshops.reduce((total, w) => total + w.studentsCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Évaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Workshops Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Mes Ateliers</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Atelier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Créer un Nouvel Atelier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'atelier</Label>
                  <Input
                    id="name"
                    value={newWorkshop.name}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                    placeholder="Ex: Mathématiques, Sciences..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkshop.description}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
                    placeholder="Décrivez l'objectif de cet atelier..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateWorkshop} className="bg-blue-600 hover:bg-blue-700">
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <Link key={workshop.id} to={`/workshop/${workshop.id}/students`}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {workshop.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {workshop.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{workshop.studentsCount} élèves</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {workshop.createdAt.toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}