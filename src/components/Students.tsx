import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, User, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Student {
  id: string
  name: string
  avatar?: string
  grade?: 'green' | 'orange' | 'red' | null
  lastWork?: Date
}

export default function Students() {
  const { id: workshopId } = useParams()
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Emma Martin', grade: 'green', lastWork: new Date('2024-01-20') },
    { id: '2', name: 'Lucas Dubois', grade: 'orange', lastWork: new Date('2024-01-19') },
    { id: '3', name: 'Chloé Durand', grade: null },
    { id: '4', name: 'Nathan Leroy', grade: 'red', lastWork: new Date('2024-01-18') },
    { id: '5', name: 'Léa Moreau', grade: 'green', lastWork: new Date('2024-01-21') },
    { id: '6', name: 'Hugo Simon', grade: null },
    { id: '7', name: 'Manon Laurent', grade: 'orange', lastWork: new Date('2024-01-17') },
    { id: '8', name: 'Théo Petit', grade: 'green', lastWork: new Date('2024-01-22') }
  ])

  const [newStudent, setNewStudent] = useState({ name: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddStudent = () => {
    if (newStudent.name.trim()) {
      const student: Student = {
        id: Date.now().toString(),
        name: newStudent.name,
        grade: null
      }
      setStudents([...students, student])
      setNewStudent({ name: '' })
      setIsDialogOpen(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGradeBadge = (grade: string | null) => {
    if (!grade) return null
    
    const styles = {
      green: 'bg-green-100 text-green-800 border-green-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    }

    return (
      <div className={`w-3 h-3 rounded-full ${styles[grade as keyof typeof styles].replace('text-', 'bg-').replace('-800', '-500').replace('bg-', '').replace('-100', '')}`} />
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Trombinoscope</h1>
            <p className="text-sm text-gray-600">Atelier #{workshopId}</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un élève
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter un Élève</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Nom de l'élève</Label>
                <Input
                  id="studentName"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ name: e.target.value })}
                  placeholder="Prénom Nom"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un élève..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredStudents.map((student) => (
          <Link key={student.id} to={`/workshop/${workshopId}/student/${student.id}`}>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    {student.grade && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        {getGradeBadge(student.grade)}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-sm font-medium text-center text-gray-800 leading-tight">
                    {student.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center">
                  {student.lastWork ? (
                    <div className="text-xs text-gray-500">
                      Dernière éval: {student.lastWork.toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: '2-digit' 
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">Pas d'évaluation</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucun élève trouvé</p>
        </div>
      )}
    </div>
  )
}