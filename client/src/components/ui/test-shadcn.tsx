import React from 'react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import { Alert, AlertDescription } from './alert'
import { Info } from 'lucide-react'

export function TestShadcn() {
  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Teste do shadcn/ui</CardTitle>
          <CardDescription>
            Verificando se todos os componentes estão funcionando corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-input">Input de teste</Label>
            <Input id="test-input" placeholder="Digite algo aqui..." />
          </div>
          
          <div className="flex gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Este é um teste do componente Alert do shadcn/ui
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Teste Completo</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 