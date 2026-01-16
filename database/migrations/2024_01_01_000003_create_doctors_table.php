<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_ms')->nullable();
            $table->string('specialization');
            $table->string('specialization_ms')->nullable();
            $table->string('qualification')->nullable();
            $table->string('qualification_ms')->nullable();
            $table->integer('experience_years')->nullable();
            $table->json('languages')->nullable();
            $table->text('bio')->nullable();
            $table->text('bio_ms')->nullable();
            $table->string('image')->nullable();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
            $table->index('specialization');
            $table->index(['branch_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
