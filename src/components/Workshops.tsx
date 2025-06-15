import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Workshops() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Ateliers</h1>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-600">Cette page sera développée prochainement.</p>
      </div>
    </div>
  )
}